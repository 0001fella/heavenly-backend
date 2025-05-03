import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'Outlook', 'Yahoo', etc.
      auth: {
        user: process.env.EMAIL_USER,       // your email
        pass: process.env.EMAIL_PASSWORD,   // app password (not your login password)
      },
    });

    const mailOptions = {
      from: `"Heavenly Rhythms Studio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

export default sendEmail;
