import nodemailer from "nodemailer";
import "../config.js";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // actually send the mail
  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${options.email}`);
};

export default sendEmail;
