export const orderCancelledEmail = ({ user, order }) => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:40px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">

    <tr>
    <td style="background:#dc2626;padding:30px;text-align:center;">
    <h1 style="margin:0;color:#fff;">Vedic India</h1>
    <p style="margin-top:10px;color:#fee2e2;">
    Your Order has been Cancelled
    </p>
    </td>
    </tr>

    <tr>
    <td style="padding:40px;">

    <h2>Hello ${user.name},</h2>

    <p style="line-height:1.8;color:#555;">
    Your order has been cancelled.
    </p>

    <div style="background:#fef2f2;border-left:5px solid #dc2626;padding:18px;margin:30px 0;">
    <strong>Order Number:</strong> ${order.orderNumber}<br>
    <strong>Status:</strong> Cancelled
    </div>

    <p style="line-height:1.8;color:#555;">
    ${
        order.paymentInfo.method === "razorpay"
            ? "If your payment was successful, your refund will be processed shortly. Refunds usually reflect in your original payment method within 5–7 business days."
            : "Since this was a Cash on Delivery order, no payment was charged."
    }
    </p>

    <p style="line-height:1.8;color:#555;">
    If you have any questions, please contact our support team.
    </p>

    <hr style="margin:35px 0;">

    <p style="color:#666;">
    Thank you for choosing <strong>Vedic India</strong>.
    </p>

    </td>
    </tr>

    <tr>
    <td style="background:#f9fafb;padding:25px;text-align:center;font-size:13px;color:#777;">
    This is an automated email from <strong>Vedic India</strong>.
    </td>
    </tr>

    </table>

    </body>
    </html>
    `;
};