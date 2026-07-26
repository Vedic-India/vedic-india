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
        select: "name slug price stock isActive images"
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
            throw new ApiError(400, `${product.name} is currently unavailable.`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `${product.name} has only ${product.stock} item(s) left.`);
        }

        const itemTotal = product.price * item.quantity;
        itemsTotal += itemTotal;

        orderItems.push({
            product: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            quantity: item.quantity
        });
    }

    // Modify according to the business logic
    const SHIPPING_CHARGE = 0;

    const shippingFee = itemsTotal >= 999 ? 0 : SHIPPING_CHARGE;

    const itemsTotalRounded = Number(itemsTotal.toFixed(2));

    const totalAmount = Number(
        (itemsTotalRounded + shippingFee).toFixed(2)
    );

    const orderId = new mongoose.Types.ObjectId();

    const order = await Order.create({
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
            pincode: address.pincode
        },

        itemsTotal: itemsTotalRounded,
        shippingFee,
        totalAmount,

        paymentInfo: {
            amount: totalAmount,
            method: paymentMethod,
            status: "pending",
        },

        orderStatus: "placed"
    });

    // Create Razorpay Order
    let razorpayOrder = null;

    if (paymentMethod === "razorpay") {
        try {
            razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100), // Amount in paise
                currency: "INR",
                receipt: order.orderNumber,

                notes: {
                    orderNumber: order.orderNumber,
                    userId: req.user._id.toString(),
                },
            });

            order.paymentInfo.razorpayOrderId = razorpayOrder.id;
            await order.save();
        } catch (error) {
            await Order.findByIdAndDelete(order._id);

            throw new ApiError(500,"Unable to initiate payment. Please try again.");
        }
    }
    else{
        try{
            const itemsTable = order.items.map((item) => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price}</td>
                        <td>₹${item.price * item.quantity}</td>
                    </tr>
                `)
                .join("");
            await sendEmail({
                to: user.email,
                subject: `Your Vedic India Order is Placed (#${order.orderNumber})`,
                html: orderPlacedEmail({ user, order }),
            });
        }
        catch(error){
            console.error("Failed to send order confirmation email:", error);
        }
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                order,
                razorpayOrder,
                key: paymentMethod === "razorpay" ? process.env.RAZORPAY_KEY_ID : null
            },
            "Order created successfully."
        )
    );
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

            if (result.modifiedCount === 0) { // TODO: Should i modify order status to failed and initiate refund process here and also send a order failed email?
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

    } catch (error) { // TODO: Should i modify order status to failed and initiate refund process here?
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export { 
    createOrder, 
    verifyPayment 
};