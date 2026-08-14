import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
});

transporter.verify()
    .then(() => {
        console.log("✅ Gmail SMTP connection successful");
    })
    .catch((error) => {
        console.error("❌ Gmail SMTP connection failed:");
        console.error(error);
    });

const sendEmail = async ({
    to,
    subject,
    html
}) => {
    await transporter.sendMail({
        from: `"Vedic India" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
};

export { sendEmail };