import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
});

transporter.verify()
    .then(() => {
        console.log("✅ Brevo SMTP connection successful");
    })
    .catch((error) => {
        console.error("❌ Brevo SMTP connection failed:");
        console.error(error);
    });

const sendEmail = async ({
    to,
    subject,
    html
}) => {
    await transporter.sendMail({
        from: `"Vedic India" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        html
    });
};

export { sendEmail };