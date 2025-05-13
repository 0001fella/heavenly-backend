// utils/sendEmail.js

import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }) => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('⚠️ Missing email credentials in environment variables');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Heavenly Rhythms Studio" <${EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to}: ${info.response}`);
};

export default sendEmail;
