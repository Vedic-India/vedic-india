export const orderPlacedEmail = ({ user, order }) => {
    const itemsTable = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding:12px;border:1px solid #e5e7eb;">
                    ${item.name}
                </td>
                <td style="padding:12px;text-align:center;border:1px solid #e5e7eb;">
                    ${item.quantity}
                </td>
                <td style="padding:12px;text-align:right;border:1px solid #e5e7eb;">
                    ₹${item.price}
                </td>
                <td style="padding:12px;text-align:right;border:1px solid #e5e7eb;">
                    ₹${item.price * item.quantity}
                </td>
            </tr>
        `
        )
        .join("");

    return `
        <!DOCTYPE html>
        <html>

        <body style="
            margin:0;
            padding:40px 0;
            background:#f3f4f6;
            font-family:Arial,Helvetica,sans-serif;
        ">

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="max-width:700px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;"
        >

        <tr>
        <td style="background:#0f766e;padding:30px;text-align:center;">

        <h1 style="margin:0;color:#ffffff;">
        Vedic India
        </h1>

        <p style="margin-top:10px;color:#d1fae5;">
        Premium Alkaline Water Solutions
        </p>

        </td>
        </tr>

        <tr>
        <td style="padding:40px;">

        <h2 style="margin-top:0;">
        Thank you for your order, ${user.name}! 🎉
        </h2>

        <p style="line-height:1.7;color:#555;">
        We've successfully received your order and it's now being processed.
        We'll notify you once your order has been shipped.
        </p>

        <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;">

        <h3>Order Details</h3>

        <table style="width:100%;margin-bottom:30px;">
        <tr>
        <td><strong>Order Number</strong></td>
        <td>${order.orderNumber}</td>
        </tr>

        <tr>
        <td><strong>Order Date</strong></td>
        <td>
        ${new Date(order.createdAt).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        )}
        </td>
        </tr>

        <tr>
        <td><strong>Payment Method</strong></td>
        <td>
        ${order.paymentInfo.method === "cod"
            ? "Cash on Delivery"
            : "Prepaid (Razorpay)"}
        </td>
        </tr>

        <tr>
        <td><strong>Estimated Delivery</strong></td>
        <td>3–5 Business Days</td>
        </tr>
        </table>

        <h3>Items Ordered</h3>

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="border-collapse:collapse;margin-top:15px;"
        >

        <thead>

        <tr style="background:#f9fafb;">

        <th style="padding:12px;border:1px solid #e5e7eb;text-align:left;">
        Product
        </th>

        <th style="padding:12px;border:1px solid #e5e7eb;">
        Qty
        </th>

        <th style="padding:12px;border:1px solid #e5e7eb;text-align:right;">
        Price
        </th>

        <th style="padding:12px;border:1px solid #e5e7eb;text-align:right;">
        Total
        </th>

        </tr>

        </thead>

        <tbody>

        ${itemsTable}

        </tbody>

        </table>

        <table
        style="
        width:100%;
        margin-top:25px;
        ">

        <tr>

        <td><strong>Items Total</strong></td>

        <td style="text-align:right;">
        ₹${order.itemsTotal}
        </td>

        </tr>

        <tr>

        <td><strong>Shipping</strong></td>

        <td style="text-align:right;">
        ₹${order.shippingFee}
        </td>

        </tr>

        <tr>

        <td style="padding-top:15px;font-size:18px;">
        <strong>Grand Total</strong>
        </td>

        <td
        style="
        padding-top:15px;
        text-align:right;
        font-size:18px;
        font-weight:bold;
        color:#0f766e;
        "
        >
        ₹${order.totalAmount}
        </td>

        </tr>

        </table>

        <hr style="margin:35px 0;border:none;border-top:1px solid #e5e7eb;">

        <h3>Shipping Address</h3>

        <p style="line-height:1.7;color:#555;">

        ${order.shippingAddress.fullName}<br>

        ${order.shippingAddress.addressLine1}<br>

        ${order.shippingAddress.addressLine2 ?? ""}

        ${order.shippingAddress.addressLine2 ? "<br>" : ""}

        ${order.shippingAddress.city},
        ${order.shippingAddress.state}
        -
        ${order.shippingAddress.pincode}

        <br>

        Phone:
        ${order.shippingAddress.phone}

        </p>

        <hr style="margin:35px 0;border:none;border-top:1px solid #e5e7eb;">

        <p>
        Thank you for choosing
        <strong>Vedic India</strong>.
        We truly appreciate your trust in us.
        </p>

        </td>

        </tr>

        <tr>

        <td
        style="
        background:#f9fafb;
        padding:25px;
        text-align:center;
        font-size:13px;
        color:#777;
        "
        >

        This is an automated email from
        <strong>Vedic India</strong>.

        <br><br>

        If you have any questions,
        please contact our support team.

        </td>

        </tr>

        </table>

        </body>

        </html>
    `;
};