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
import { paymentFailedEmail } from "../utils/emailtemplates/paymentFailedEmail.js";
import mongoose from "mongoose";
import crypto from "crypto";

const handleFailedPayment = asyncHandler(async ({order, payment, reason = "Unable to fulfil your order."}) => {
    // Refund the payment
    const refund = await razorpay.payments.refund(payment.id, { //TODO: IF REFUND FAILS RETRY
        amount: payment.amount,
        notes: {
            orderNumber: order.orderNumber,
            reason,
        },
    });

    // Update order
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const updatedOrder = await Order.findById(order._id).session(session);

        if (!updatedOrder) {
            throw new ApiError(404, "Order not found.");
        }

        updatedOrder.orderStatus = "cancelled";

        updatedOrder.paymentInfo.status = "refunded";
        updatedOrder.paymentInfo.refundId = refund.id;
        updatedOrder.paymentInfo.refundedAt = new Date();
        updatedOrder.paymentInfo.failureReason = reason;

        await updatedOrder.save({ session });

        await session.commitTransaction();

        // Send refund email
        try {
            const user = await User.findById(updatedOrder.user).select(
                "fullName email"
            );

            if (user?.email) {
                await sendEmail({
                    to: user.email,
                    subject: `Refund Initiated for Order #${updatedOrder.orderNumber}`,
                    html: paymentFailedEmail({
                        user,
                        order: updatedOrder,
                        reason,
                    }),
                });
            }
        } catch (emailError) {
            console.error(
                "Failed to send refund email:",
                emailError
            );
        }

        return updatedOrder;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

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

    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed.");
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
        throw new ApiError(400, "Payment has not been captured.");
    }

    if (payment.order_id !== razorpay_order_id) {
        throw new ApiError(400, "Payment does not belong to this order.");
    }

    if (payment.currency !== "INR") {
        throw new ApiError(400, "Invalid payment currency.");
    }

    let failedOrder = null;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const order = await Order.findOne({
            "paymentInfo.razorpayOrderId": razorpay_order_id,
        }).session(session);

        if (!order) {
            throw new ApiError(404, "Order not found.");
        }

        if (order.user.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized.");
        }

        if (order.paymentInfo.status === "paid") {
            await session.commitTransaction();

            return res.status(200).json(
                new ApiResponse(200, order,"Payment already verified.")
            );
        }

        if (payment.amount !== Math.round(order.totalAmount * 100)) {
            throw new ApiError(400, "Payment amount mismatch.");
        }

        for (const item of order.items) {
            const result = await Product.updateOne(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                },
                {
                    session,
                }
            );

            if (result.modifiedCount === 0) {
                failedOrder = order;
                throw new ApiError(400, `${item.name} is out of stock.`);
            }
        }

        const cart = await Cart.findOne({
            user: order.user,
        }).session(session);

        if (cart) {
            cart.items = [];
            await cart.save({ session });
        }

        order.paymentInfo.status = "paid";
        order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
        order.paymentInfo.razorpaySignature = razorpay_signature;
        order.paymentInfo.paidAt = new Date();

        await order.save({ session });

        await session.commitTransaction();

        try {
            await sendEmail({
                to: req.user.email,
                subject: `Your Vedic India Order is Placed (#${order.orderNumber})`,
                html: orderPlacedEmail({user: req.user, order}),
            });
        } catch (error) {
            console.error("Failed to send order confirmation email:", error);
        }

        return res.status(200).json(
            new ApiResponse(200,order,"Payment verified successfully.")
        );

    } catch (error) {
        await session.abortTransaction();

        if (failedOrder) {
            await handleFailedPayment({
                order: failedOrder,
                payment,
                reason: error.message,
            });
        }

        throw error;
    } finally {
        session.endSession();
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));

    const { createdAt, id } = req.query;

    const filter = {
        user: req.user._id,
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

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
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
    session.startTransaction();

    try {
        const order = await Order.findById(orderId).session(session);

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

        // Restore stock
        for (const item of order.items) {
            await Product.updateOne(
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
        }

        order.orderStatus = "cancelled";
        order.cancelledAt = new Date();

        if (
            order.paymentInfo.method === "razorpay" &&
            order.paymentInfo.status === "paid"
        ) {
            const refund = await razorpay.payments.refund(
                order.paymentInfo.paymentId,
                {
                    amount: Math.round(order.totalAmount * 100),
                }
            );

            order.paymentInfo.status = "refunded";
            order.paymentInfo.refundId = refund.id;
            order.paymentInfo.refundedAt = new Date();
        }

        await order.save({ session });

        await session.commitTransaction();

        const user = await User.findById(order.user).select(
            "name email"
        );

        if (user) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: `Your Order #${order.orderNumber} has been Cancelled`,
                    html: orderCancelledEmail({
                        user,
                        order,
                    }),
                });
            } catch (error) {
                console.error(error);
            }
        }

        return res.status(200).json(
            new ApiResponse(200, order, "Order cancelled successfully.")
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
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