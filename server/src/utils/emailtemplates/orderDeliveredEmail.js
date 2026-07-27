export const orderDeliveredEmail = ({ user, order }) => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:40px 0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">

    <tr>
    <td style="background:#16a34a;padding:30px;text-align:center;">
    <h1 style="margin:0;color:#fff;">Vedic India</h1>
    <p style="margin-top:10px;color:#dcfce7;">
    Your Order has been Delivered 🎉
    </p>
    </td>
    </tr>

    <tr>
    <td style="padding:40px;">

    <h2>Hello ${user.name},</h2>

    <p style="line-height:1.8;color:#555;">
    Your order has been successfully delivered.
    We hope you enjoy your Vedic India products!
    </p>

    <div style="background:#f0fdf4;border-left:5px solid #16a34a;padding:18px;margin:30px 0;">
    <strong>Order Number:</strong> ${order.orderNumber}<br>
    <strong>Status:</strong> Delivered<br>
    <strong>Delivered On:</strong>
    ${new Date(order.deliveredAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })}
    </div>

    <p style="line-height:1.8;color:#555;">
    Thank you for trusting Vedic India.
    We'd love to hear your feedback about your experience.
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