import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import { razorpay } from "../config/razorpay.js";
import { sendEmail } from "../utils/sendEmail.js";
import { orderPlacedEmail } from "../utils/emailtemplates/orderPlacedEmail.js";
import { orderShippedEmail } from "../utils/emailtemplates/orderShippedEmail.js";
import { orderDeliveredEmail } from "../utils/emailtemplates/orderDeliveredEmail.js";
import { orderCancelledEmail } from "../utils/emailtemplates/orderCancelledEmail.js";
import { completePaidOrder } from "../services/orderPayment.service.js";
import mongoose from "mongoose";
import crypto from "crypto";

const createOrder = asyncHandler(async (req, res) => {
    const { addressId } = req.body;
    const paymentMethod = req.body.paymentMethod ?? "razorpay";

    if (!["razorpay", "cod"].includes(paymentMethod)) {
        throw new ApiError(400, "Invalid payment method.");
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: "items.product",
        select: "name slug price stock isActive images",
    });

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty.");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, "Shipping address not found.");
    }

    let itemsTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = item.product;

        if (!product) {
            throw new ApiError(400, "One or more products no longer exist.");
        }

        if (!product.isActive) {
            throw new ApiError(
                400,
                `${product.name} is currently unavailable.`
            );
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.name} has only ${product.stock} item(s) left.`
            );
        }

        itemsTotal += product.price * item.quantity;

        orderItems.push({
            product: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            quantity: item.quantity,
        });
    }

    const SHIPPING_CHARGE = 0;

    const shippingFee = itemsTotal >= 999 ? 0 : SHIPPING_CHARGE;

    const itemsTotalRounded = Number(itemsTotal.toFixed(2));

    const totalAmount = Number(
        (itemsTotalRounded + shippingFee).toFixed(2)
    );

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const orderId = new mongoose.Types.ObjectId();

        const [order] = await Order.create(
            [
                {
                    _id: orderId,
                    orderNumber: generateOrderNumber(orderId),

                    user: req.user._id,

                    items: orderItems,

                    shippingAddress: {
                        fullName: address.fullName,
                        phone: address.phone,
                        addressLine1: address.addressLine1,
                        addressLine2: address.addressLine2,
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode,
                    },

                    itemsTotal: itemsTotalRounded,
                    shippingFee,
                    totalAmount,

                    paymentInfo: {
                        amount: totalAmount,
                        method: paymentMethod,
                        status: "pending",
                    },

                    orderStatus: "placed",
                },
            ],
            { session }
        );

        let razorpayOrder = null;

        if (paymentMethod === "cod") {
            for (const item of order.items) {
                const result = await Product.updateOne(
                    {
                        _id: item.product,
                        stock: {
                            $gte: item.quantity,
                        },
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    },
                    { session }
                );

                if (result.modifiedCount === 0) {
                    throw new ApiError(400, "One or more products are now out of stock.");
                }
            }

            cart.items = [];
            await cart.save({ session });
        }
        else if (paymentMethod === "razorpay") {
            try {
                razorpayOrder = await razorpay.orders.create({
                    amount: Math.round(totalAmount * 100),
                    currency: "INR",
                    receipt: order.orderNumber,
                    notes: {
                        orderNumber: order.orderNumber,
                        userId: req.user._id.toString(),
                    },
                });

                order.paymentInfo.razorpayOrderId = razorpayOrder.id;
                await order.save( { session } );
            } catch (error) {
                throw new ApiError(500, "Unable to initiate payment. Please try again.");
            }
        }

        await session.commitTransaction();

        if (paymentMethod === "cod") {
            try {
                await sendEmail({
                    to: user.email,
                    subject: `Your Vedic India Order is Confirmed (#${order.orderNumber})`,
                    html: orderPlacedEmail({
                        user,
                        order,
                    }),
                });
            } catch (error) {
                console.error("Failed to send confirmation email:",error);
            }
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    order,
                    razorpayOrder,
                    key:
                        paymentMethod === "razorpay"
                            ? process.env.RAZORPAY_KEY_ID
                            : null,
                },
                "Order created successfully."
            )
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if ( !razorpay_order_id || !razorpay_payment_id || !razorpay_signature ) {
        throw new ApiError(400, "Missing payment details.");
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const expectedSignature = Buffer.from(generatedSignature, "utf8");
    const receivedSignature = Buffer.from(razorpay_signature, "utf8");
    const signaturesMatch =
        expectedSignature.length === receivedSignature.length &&
        crypto.timingSafeEqual(expectedSignature, receivedSignature);

    if (!signaturesMatch) {
        throw new ApiError(400, "Payment verification failed.");
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.order_id !== razorpay_order_id) {
        throw new ApiError(400, "Payment does not belong to this order.");
    }

    if (payment.currency !== "INR") {
        throw new ApiError(400, "Invalid payment currency.");
    }

    const { order, alreadyCompleted } = await completePaidOrder({
        razorpayOrderId: razorpay_order_id,
        payment,
        razorpaySignature: razorpay_signature,
        expectedUserId: req.user._id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            alreadyCompleted
                ? "Payment already verified."
                : "Payment verified successfully."
        )
    );
});

const getMyOrders = asyncHandler(async (req, res) => {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));

    const { createdAt, id } = req.query;

    const filter = {
        user: req.user._id,
            $nor: [
            {
                "paymentInfo.method": "razorpay",
                "paymentInfo.status": "pending",
            },
        ],
    };

    if (createdAt && id) {
        filter.$or = [
            {
                createdAt: { $lt: new Date(createdAt) },
            },
            {
                createdAt: new Date(createdAt),
                _id: { $lt: new mongoose.Types.ObjectId(id) },
            },
        ];
    }

    const orders = await Order.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit + 1)
        .select(
            "orderNumber items totalAmount paymentInfo.status paymentInfo.method orderStatus createdAt"
        )
        .lean();

    let nextCursor = null;
    let hasMore = false;

    if (orders.length > limit) {
        hasMore = true;

        const lastOrder = orders[limit - 1];

        nextCursor = {
            createdAt: lastOrder.createdAt,
            id: lastOrder._id,
        };

        orders.pop();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orders,
                nextCursor,
                hasMore,
            },
            "Orders fetched successfully."
        )
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order ID.");
    }

    const order = await Order.findById(orderId)
        .populate({
            path: "user",
            select: "name email phone",
        })
        .lean();

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to access this order.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully."
        )
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const {
        createdAt,
        id,
        orderStatus,
        paymentStatus,
        search,
    } = req.query;

    const filter = {};

    if (orderStatus) {
        filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
        filter["paymentInfo.status"] = paymentStatus;
    }

    if (search) {
        filter.orderNumber = {
            $regex: search,
            $options: "i",
        };
    }

    if (createdAt && id) {
        filter.$or = [
            {
                createdAt: {
                    $lt: new Date(createdAt),
                },
            },
            {
                createdAt: new Date(createdAt),
                _id: {
                    $lt: new mongoose.Types.ObjectId(id),
                },
            },
        ];
    }

    const orders = await Order.find(filter)
        .sort({
            createdAt: -1,
            _id: -1,
        })
        .limit(limit + 1)
        .populate({
            path: "user",
            select: "name email",
        })
        .select("-__v")
        .lean();

    let hasMore = false;
    let nextCursor = null;

    if (orders.length > limit) {
        hasMore = true;

        const lastOrder = orders[limit - 1];

        nextCursor = {
            createdAt: lastOrder.createdAt,
            id: lastOrder._id,
        };

        orders.pop();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orders,
                nextCursor,
                hasMore,
            },
            "Orders fetched successfully."
        )
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order ID.");
    }

    const validStatuses = [
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
        throw new ApiError(400, "Invalid order status.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    const statusFlow = {
        placed: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
    };

    if (!statusFlow[order.orderStatus].includes(orderStatus)) {
        throw new ApiError(400,`Cannot change order status from "${order.orderStatus}" to "${orderStatus}".`);
    }

    order.orderStatus = orderStatus;

    switch (orderStatus) {
        case "shipped":
            order.shippedAt = new Date();
            break;

        case "delivered":
            order.deliveredAt = new Date();
            break;

        case "cancelled":
            order.cancelledAt = new Date();
            break;
    }

    await order.save();

    try {
        const user = await User.findById(order.user).select("name email");

        if (user) {
            switch (orderStatus) {
                case "shipped":
                    await sendEmail({
                        to: user.email,
                        subject: `Your Order #${order.orderNumber} has been Shipped`,
                        html: orderShippedEmail({
                            user,
                            order,
                        }),
                    });
                    break;

                case "delivered":
                    await sendEmail({
                        to: user.email,
                        subject: `Your Order #${order.orderNumber} has been Delivered`,
                        html: orderDeliveredEmail({
                            user,
                            order,
                        }),
                    });
                    break;

                case "cancelled":
                    await sendEmail({
                        to: user.email,
                        subject: `Your Order #${order.orderNumber} has been Cancelled`,
                        html: orderCancelledEmail({
                            user,
                            order,
                        }),
                    });
                    break;
            }
        }
    } catch (error) {
        console.error("Failed to send order status email:", error);
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully.")
    );
});

const markOrderPaid = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order ID.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.paymentInfo.method !== "cod") {
        throw new ApiError(400,"Only Cash on Delivery orders can be marked as paid.");
    }

    if (order.paymentInfo.status === "paid") {
        throw new ApiError(400, "Order has already been marked as paid.");
    }

    if (order.orderStatus !== "delivered") {
        throw new ApiError(400,"Payment can only be marked as paid after the order is delivered.");
    }

    order.paymentInfo.status = "paid";
    order.paymentInfo.paidAt = new Date();

    await order.save();

    return res.status(200).json(
        new ApiResponse(200, order, "Order marked as paid successfully.")
    );
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order ID.");
    }

    const session = await mongoose.startSession();

    let order;
    let shouldRefund = false;

    try {
        await session.withTransaction(async () => {
            order = await Order.findById(orderId).session(session);

            if (!order) {
                throw new ApiError(404, "Order not found.");
            }

            const isAdmin = req.user.role === "admin";

            if (
                !isAdmin &&
                order.user.toString() !== req.user._id.toString()
            ) {
                throw new ApiError(403, "Unauthorized.");
            }

            if (order.orderStatus === "cancelled") {
                throw new ApiError(400, "Order is already cancelled.");
            }

            if (order.orderStatus === "shipped") {
                throw new ApiError(
                    400,
                    "Shipped orders cannot be cancelled."
                );
            }

            if (order.orderStatus === "delivered") {
                throw new ApiError(
                    400,
                    "Delivered orders cannot be cancelled."
                );
            }

            // Prevent two cancellation/refund requests from running
            // against the same paid Razorpay order.
            if (order.paymentInfo.refundProcessing) {
                throw new ApiError(
                    409,
                    "Order cancellation/refund is already being processed."
                );
            }

            shouldRefund =
                order.paymentInfo.method === "razorpay" &&
                order.paymentInfo.status === "paid";

            /*
             * For Razorpay-paid orders:
             *
             * DO NOT restore stock here.
             * DO NOT mark payment as refunded here.
             *
             * The refund.processed webhook will do that after
             * Razorpay confirms the refund.
             */
            if (shouldRefund) {
                order.paymentInfo.refundProcessing = true;
            } else {
                /*
                 * COD / unpaid orders don't need a Razorpay refund,
                 * so stock can be restored immediately.
                 */
                for (const item of order.items) {
                    const result = await Product.updateOne(
                        {
                            _id: item.product,
                        },
                        {
                            $inc: {
                                stock: item.quantity,
                            },
                        },
                        { session }
                    );

                    if (result.modifiedCount === 0) {
                        throw new ApiError(
                            500,
                            `Unable to restore stock for ${item.name}.`
                        );
                    }
                }
            }

            order.orderStatus = "cancelled";
            order.cancelledAt = new Date();

            await order.save({ session });
        });
    } finally {
        await session.endSession();
    }

    /*
     * Razorpay refund is intentionally performed AFTER the
     * MongoDB transaction has committed.
     */
    if (shouldRefund) {
        try {
            const refund = await razorpay.payments.refund(
                order.paymentInfo.razorpayPaymentId,
                {
                    amount: Math.round(order.totalAmount * 100),
                    notes: {
                        orderNumber: order.orderNumber,
                        reason: "Order cancelled by user/admin",
                    },
                }
            );

            console.log("Refund requested:", refund.id);
            console.log("Refund status:", refund.status);

            /*
             * Do NOT mark the order as refunded here.
             *
             * refund.processed webhook will eventually call:
             *
             * processRefundedOrder()
             *
             * which will:
             * - restore stock
             * - set payment status = refunded
             * - save refund ID
             * - save refundedAt
             * - set refundProcessing = false
             */
        } catch (refundError) {
            console.error(
                "Failed to initiate Razorpay refund:",
                refundError
            );

            /*
             * Refund request failed, so release the processing lock.
             * The payment remains "paid", because no successful refund
             * has been confirmed.
             */
            try {
                await Order.updateOne(
                    {
                        _id: order._id,
                        "paymentInfo.refundProcessing": true,
                    },
                    {
                        $set: {
                            "paymentInfo.refundProcessing": false,
                            "paymentInfo.failureReason":
                                refundError?.description ||
                                refundError?.message ||
                                "Unable to initiate refund.",
                        },
                    }
                );
            } catch (resetError) {
                console.error(
                    "Failed to reset refund processing state:",
                    resetError
                );
            }

            throw new ApiError(
                500,
                "Order was cancelled, but the refund could not be initiated. Please contact support."
            );
        }
    }

    /*
     * Send cancellation email after the cancellation transaction
     * has successfully committed.
     */
    try {
        const user = await User.findById(order.user).select(
            "name email"
        );

        if (user?.email) {
            await sendEmail({
                to: user.email,
                subject: `Your Order #${order.orderNumber} has been Cancelled`,
                html: orderCancelledEmail({
                    user,
                    order,
                }),
            });
        }
    } catch (error) {
        console.error(
            "Failed to send order cancellation email:",
            error
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            shouldRefund
                ? "Order cancelled successfully. Your refund is being processed."
                : "Order cancelled successfully."
        )
    );
});

export { 
    createOrder, 
    verifyPayment,
    getMyOrders,
    getOrderById,
    getAllOrders,
    markOrderPaid,
    updateOrderStatus,
    cancelOrder,
};