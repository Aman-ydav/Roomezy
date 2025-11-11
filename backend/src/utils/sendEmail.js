import nodemailer from "nodemailer";
import "../config.js";

const sendEmail = async (options) => {

   console.log("Connecting to SMTP server:", process.env.SMTP_HOST);
  console.log("Using port:", process.env.SMTP_PORT);
  console.log("Sending email to:", options.email);

  const transporter = nodemailer.createTransport({
    service: "gmail", // use STARTTLS (important for Gmail on Render)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // avoid Render TLS rejection issue
    },
    connectionTimeout: 10000, // 10 seconds to prevent hanging
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw error;
  }
};

export default sendEmail;
