import axios from "axios";

const sendEmail = async ({ to, subject, html }) => {
    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: process.env.BREVO_FROM_NAME || "Vedic India",
                email: process.env.BREVO_FROM_EMAIL,
            },

            to: [
                {
                    email: to,
                },
            ],

            subject,
            htmlContent: html,
        },
        {
            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },

            timeout: 10000,
        }
    );

    return response.data;
};

export { sendEmail };