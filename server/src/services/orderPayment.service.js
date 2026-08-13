import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { razorpay } from "../config/razorpay.js";
import { sendEmail } from "../utils/sendEmail.js";
import { orderPlacedEmail } from "../utils/emailtemplates/orderPlacedEmail.js";
import { paymentFailedEmail } from "../utils/emailtemplates/paymentFailedEmail.js";

class StockUnavailableError extends ApiError {
    constructor(message) {
        super(400, message);
        this.name = "StockUnavailableError";
        this.code = "PAYMENT_OUT_OF_STOCK";
    }
}

const handleFailedPayment = async ({
    order,
    payment,
    reason = "Unable to fulfil your order.",
}) => {
    const refundInProgressOrder = await Order.findOneAndUpdate(
        {
            _id: order._id,
            "paymentInfo.status": { $in: ["pending", "failed"] },
            "paymentInfo.refundProcessing": { $ne: true },
            "paymentInfo.refundId": { $exists: false },
        },
        {
            $set: {
                "paymentInfo.refundProcessing": true,
                "paymentInfo.razorpayPaymentId": payment.id,
                "paymentInfo.failureReason": reason,
            },
        },
        { new: true }
    );

    // Another request or webhook has already started or completed the refund.
    if (!refundInProgressOrder) {
        return null;
    }

    const refund = await razorpay.payments.refund(payment.id, {
        amount: payment.amount,
        notes: {
            orderNumber: refundInProgressOrder.orderNumber,
            reason,
        },
    });
    const refundedAt = new Date();

    const session = await mongoose.startSession();
    let updatedOrder = null;
    let alreadyRefunded = false;

    try {
        await session.withTransaction(async () => {
            updatedOrder = await Order.findById(refundInProgressOrder._id)
                .session(session);

            if (!updatedOrder) {
                throw new ApiError(404, "Order not found.");
            }

            if (updatedOrder.paymentInfo.status === "refunded") {
                alreadyRefunded = true;
                updatedOrder.orderStatus = "cancelled";
                updatedOrder.cancelledAt = updatedOrder.cancelledAt || refundedAt;
                updatedOrder.paymentInfo.refundProcessing = false;
                await updatedOrder.save({ session });
                return;
            }

            updatedOrder.orderStatus = "cancelled";
            updatedOrder.cancelledAt = updatedOrder.cancelledAt || refundedAt;
            updatedOrder.paymentInfo.status = "refunded";
            updatedOrder.paymentInfo.refundProcessing = false;
            updatedOrder.paymentInfo.refundId = refund.id;
            updatedOrder.paymentInfo.refundedAt = refundedAt;
            updatedOrder.paymentInfo.failureReason = reason;

            await updatedOrder.save({ session });
        });

        if (!alreadyRefunded) {
            try {
                const user = await User.findById(updatedOrder.user).select(
                    "name email"
                );

                if (user?.email) {
                    sendEmail({
                        to: user.email,
                        subject: `Refund Initiated for Order #${updatedOrder.orderNumber}`,
                        html: paymentFailedEmail({
                            user,
                            order: updatedOrder,
                            reason,
                        }),
                    }).catch((error) => {
                        console.error("Failed to send refund email:", error);
                    });
                }
            } catch (emailError) {
                console.error("Failed to send refund email:", emailError);
            }
        }

        return updatedOrder;
    } catch (error) {
        try {
            await Order.updateOne(
                {
                    _id: refundInProgressOrder._id,
                    "paymentInfo.refundProcessing": true,
                },
                {
                    $set: {
                        "paymentInfo.refundProcessing": false,
                    },
                }
            );
        } catch (resetError) {
            console.error("Failed to reset refund processing state:", resetError);
        }

        console.error("Failed to update order after refund:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

const completePaidOrder = async ({
    razorpayOrderId,
    payment,
    razorpaySignature,
    expectedUserId,
}) => {
    if (payment.status !== "captured") {
        throw new ApiError(400, "Payment has not been captured.");
    }

    let completion = null;
    let failedOrder = null;

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const order = await Order.findOne({
                "paymentInfo.razorpayOrderId": razorpayOrderId,
            }).session(session);

            if (!order) {
                throw new ApiError(404, "Order not found.");
            }

            if (
                expectedUserId &&
                order.user.toString() !== expectedUserId.toString()
            ) {
                throw new ApiError(403, "Unauthorized.");
            }

            if (order.paymentInfo.status === "paid") {
                completion = {
                    order,
                    alreadyCompleted: true,
                    paymentStatus: order.paymentInfo.status,
                };
                return;
            }

            if (order.paymentInfo.status === "refunded") {
                completion = {
                    order,
                    alreadyCompleted: true,
                    paymentStatus: order.paymentInfo.status,
                };
                return;
            }

            if (order.paymentInfo.refundProcessing) {
                throw new ApiError(409, "Payment refund is already being processed.");
            }

            if (order.paymentInfo.method !== "razorpay") {
                throw new ApiError(400, "Invalid payment method.");
            }

            if (payment.order_id !== razorpayOrderId) {
                throw new ApiError(400, "Payment does not belong to this order.");
            }

            if (payment.currency !== "INR") {
                throw new ApiError(400, "Invalid payment currency.");
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
                    { session }
                );

                if (result.modifiedCount === 0) {
                    failedOrder = order;
                    throw new StockUnavailableError(
                        `${item.name} is out of stock.`
                    );
                }
            }

            const cart = await Cart.findOne({ user: order.user }).session(session);

            if (cart) {
                cart.items = [];
                await cart.save({ session });
            }

            order.paymentInfo.status = "paid";
            order.paymentInfo.razorpayPaymentId = payment.id;
            order.paymentInfo.paidAt = new Date();

            if (razorpaySignature) {
                order.paymentInfo.razorpaySignature = razorpaySignature;
            }

            await order.save({ session });

            completion = {
                order,
                alreadyCompleted: false,
                paymentStatus: order.paymentInfo.status,
            };
        });
    } catch (error) {
        if (error instanceof StockUnavailableError && failedOrder) {
            try {
                await handleFailedPayment({
                    order: failedOrder,
                    payment,
                    reason: error.message,
                });
            } catch (refundError) {
                console.error(
                    "Failed to refund payment after stock failure:",
                    refundError
                );
            }
        }

        throw error;
    } finally {
        session.endSession();
    }

    if (!completion.alreadyCompleted) {
        try {
            const user = await User.findById(completion.order.user).select(
                "name email"
            );

            if (user?.email) {
                sendEmail({
                    to: user.email,
                    subject: `Your Vedic India Order is Placed (#${completion.order.orderNumber})`,
                    html: orderPlacedEmail({ user, order: completion.order }),
                }).catch((error) => {
                    console.error("Failed to send order confirmation email:", error);
                });
            }
        } catch (error) {
            console.error("Failed to send order confirmation email:", error);
        }
    }

    return completion;
};

const markFailedPayment = async ({ razorpayOrderId, payment }) => {
    const order = await Order.findOneAndUpdate(
        {
            "paymentInfo.razorpayOrderId": razorpayOrderId,
            "paymentInfo.status": { $in: ["pending", "failed"] },
            "paymentInfo.refundProcessing": { $ne: true },
        },
        {
            $set: {
                "paymentInfo.status": "failed",
                "paymentInfo.razorpayPaymentId": payment.id,
                "paymentInfo.failureReason":
                    payment.error_description ||
                    payment.error_reason ||
                    "Payment failed.",
                "paymentInfo.failedAt": new Date(),
            },
        },
        { new: true }
    );

    return order;
};

const processRefundedOrder = async ({ refund }) => {
    const session = await mongoose.startSession();

    try {
        let refundedOrder = null;

        await session.withTransaction(async () => {
            const refundedAt = new Date();
            const order = await Order.findOne({
                "paymentInfo.razorpayPaymentId": refund.payment_id,
            }).session(session);

            if (!order || order.paymentInfo.status !== "paid") {
                return;
            }

            if (refund.amount !== Math.round(order.totalAmount * 100)) {
                console.error(
                    `Ignoring partial refund ${refund.id} for order ${order.orderNumber}.`
                );
                return;
            }

            for (const item of order.items) {
                const result = await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                );

                if (result.modifiedCount === 0) {
                    throw new ApiError(
                        500,
                        `Unable to restore stock for ${item.name}.`
                    );
                }
            }

            order.orderStatus = "cancelled";
            order.cancelledAt = order.cancelledAt || refundedAt;
            order.paymentInfo.status = "refunded";
            order.paymentInfo.refundProcessing = false;
            order.paymentInfo.refundId = refund.id;
            order.paymentInfo.refundedAt = refundedAt;

            await order.save({ session });
            refundedOrder = order;
        });

        return refundedOrder;
    } finally {
        session.endSession();
    }
};

export {
    completePaidOrder,
    handleFailedPayment,
    markFailedPayment,
    processRefundedOrder,
};
