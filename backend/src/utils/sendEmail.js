import brevo from "@getbrevo/brevo";

export const sendEmail = async (to, subject, html) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

    const emailData = {
      sender: {
        name: "Roomezy",
        email: "amanyadav923949@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log("Email sent successfully:", response.statusMessage);
  } catch (error) {
    console.error(
      "Email send failed:",
      error.response?.text || error.message
    );
  }
};
