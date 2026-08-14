import brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, html }) => {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;

    sendSmtpEmail.htmlContent = html;

    sendSmtpEmail.sender = {
        name: process.env.BREVO_FROM_NAME || "Vedic India",
        email: process.env.BREVO_FROM_EMAIL,
    };

    sendSmtpEmail.to = [
        {
            email: to,
        },
    ];

    return await apiInstance.sendTransacEmail(sendSmtpEmail);
};

export { sendEmail };