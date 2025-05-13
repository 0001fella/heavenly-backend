// utils/sendEmail.js

import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail
        pass: process.env.EMAIL_PASS,       // App password or Gmail password
      },
    });

    const mailOptions = {
      from: `"Heavenly Rhythms Studio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} | Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw new Error('Email sending failed');
  }
};

export default sendEmail;
