import { Resend } from "resend";
import "../config.js";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend API
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text or HTML message
 */
const sendEmail = async (options) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Email could not be sent. Please try again later.");
  }
};

export default sendEmail;
