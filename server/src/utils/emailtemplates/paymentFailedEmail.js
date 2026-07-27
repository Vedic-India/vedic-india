export const paymentFailedEmail = ({ user, order, reason }) => `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <title>Payment Received - Refund Initiated</title>
    </head>

    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#1f2937;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
    <td align="center">

    <table width="600" cellpadding="0" cellspacing="0"
    style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);">

    <tr>
    <td style="background:#dc2626;padding:30px;text-align:center;">
    <h1 style="margin:0;color:#ffffff;font-size:28px;">
    Vedic India
    </h1>
    <p style="margin-top:10px;color:#fee2e2;font-size:16px;">
    Payment Received • Refund Initiated
    </p>
    </td>
    </tr>

    <tr>
    <td style="padding:40px;">

    <p style="font-size:18px;margin:0 0 20px;">
    Hello <strong>${user.fullName}</strong>,
    </p>

    <p style="font-size:16px;line-height:1.7;">
    We successfully received your payment for
    <strong>Order #${order.orderNumber}</strong>.
    </p>

    <p style="font-size:16px;line-height:1.7;">
    Unfortunately, while processing your order, we encountered an unexpected issue and were unable to fulfil it.
    </p>

    <table
    width="100%"
    cellpadding="12"
    style="margin:30px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;"
    >

    <tr>
    <td><strong>Order Number</strong></td>
    <td align="right">${order.orderNumber}</td>
    </tr>

    <tr>
    <td><strong>Amount Paid</strong></td>
    <td align="right">₹${order.totalAmount.toFixed(2)}</td>
    </tr>

    <tr>
    <td><strong>Reason</strong></td>
    <td align="right">${reason}</td>
    </tr>

    <tr>
    <td><strong>Refund Status</strong></td>
    <td align="right" style="color:#dc2626;font-weight:bold;">
    Initiated
    </td>
    </tr>

    </table>

    <p style="font-size:16px;line-height:1.7;">
    Your refund has been initiated and will be credited back to your original payment method within
    <strong>5–7 business days</strong> depending on your bank.
    </p>

    <p style="font-size:16px;line-height:1.7;">
    We sincerely apologize for the inconvenience caused. We appreciate your understanding and hope to serve you again soon.
    </p>

    <p style="margin-top:35px;">
    Warm regards,<br>
    <strong>Team Vedic India</strong>
    </p>

    </td>
    </tr>

    <tr>
    <td style="padding:24px;background:#f9fafb;text-align:center;font-size:13px;color:#6b7280;">
    If you have any questions regarding your refund, simply reply to this email and we'll be happy to help.
    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>
`;