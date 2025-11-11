// utils/sendEmail.js
import nodemailer from "nodemailer";
import "../config.js"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// sendEmail function
const sendEmail = async ({ email, subject, message, html, attachments }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject,
    text: message,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
