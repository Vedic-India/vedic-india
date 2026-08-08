import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
    completePaidOrder,
    markFailedPayment,
    processRefundedOrder,
} from "../services/orderPayment.service.js";

const verifyWebhookSignature = (rawBody, signature) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (
        !webhookSecret ||
        !Buffer.isBuffer(rawBody) ||
        typeof signature !== "string"
    ) {
        return false;
    }

    try {
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");
        const expectedBuffer = Buffer.from(expectedSignature, "utf8");
        const receivedBuffer = Buffer.from(signature, "utf8");

        return (
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        );
    } catch (error) {
        return false;
    }
};

const razorpayWebhook = asyncHandler(async (req, res) => {
    if (!Buffer.isBuffer(req.body)) {
        throw new ApiError(400, "Razorpay webhook requires a raw request body.");
    }

    const signature = req.get("x-razorpay-signature");

    if (!verifyWebhookSignature(req.body, signature)) {
        throw new ApiError(400, "Invalid Razorpay webhook signature.");
    }

    let event;

    try {
        event = JSON.parse(req.body.toString("utf8"));
    } catch (error) {
        throw new ApiError(400, "Invalid Razorpay webhook payload.");
    }

    if (!event || typeof event !== "object" || Array.isArray(event)) {
        throw new ApiError(400, "Invalid Razorpay webhook payload.");
    }

    switch (event.event) {
        case "payment.captured": {
            const payment = event.payload?.payment?.entity;

            if (!payment?.id || !payment?.order_id) {
                throw new ApiError(400, "Invalid payment.captured payload.");
            }

            try {
                await completePaidOrder({
                    razorpayOrderId: payment.order_id,
                    payment,
                });
            } catch (error) {
                console.error("Failed to process payment.captured webhook:", error);
            }
            break;
        }

        case "payment.failed": {
            const payment = event.payload?.payment?.entity;

            if (!payment?.id || !payment?.order_id) {
                throw new ApiError(400, "Invalid payment.failed payload.");
            }

            try {
                await markFailedPayment({
                    razorpayOrderId: payment.order_id,
                    payment,
                });
            } catch (error) {
                console.error("Failed to process payment.failed webhook:", error);
            }
            break;
        }

        case "refund.processed": {
            const refund = event.payload?.refund?.entity;

            if (!refund?.id || !refund?.payment_id) {
                throw new ApiError(400, "Invalid refund.processed payload.");
            }

            try {
                await processRefundedOrder({ refund });
            } catch (error) {
                console.error("Failed to process refund.processed webhook:", error);
            }
            break;
        }

        default:
            break;
    }

    return res.sendStatus(200);
});

export { razorpayWebhook };
