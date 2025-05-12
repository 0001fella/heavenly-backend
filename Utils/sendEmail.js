// utils/sendEmail.js

import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text, html = null }) => {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error('⚠️ Email credentials are missing in environment variables.');
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or swap with a provider like SendGrid or Mailgun for production
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Heavenly Rhythms Studio" <${EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }), // include HTML if provided
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error; // Allow higher-level handlers to deal with the failure
  }
};

export default sendEmail;
