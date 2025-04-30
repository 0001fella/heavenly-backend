const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service, e.g., Gmail, SendGrid
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
