import nodemailer from "nodemailer";
import dns from "dns/promises";
import net from "net";

async function testGmailConnection() {
    try {
        const addresses = await dns.lookup("smtp.gmail.com", {
            all: true,
        });

        console.log("Gmail addresses:", addresses);

        const socket = net.createConnection({
            host: "smtp.gmail.com",
            port: 587,
            family: 4,
        });

        socket.setTimeout(10000);

        socket.on("connect", () => {
            console.log("✅ TCP connection to Gmail SMTP succeeded");
            socket.destroy();
        });

        socket.on("timeout", () => {
            console.log("❌ TCP connection to Gmail SMTP timed out");
            socket.destroy();
        });

        socket.on("error", (error) => {
            console.log("❌ TCP connection to Gmail SMTP failed:", error);
        });
    } catch (error) {
        console.error("DNS lookup failed:", error);
    }
}

testGmailConnection();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
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