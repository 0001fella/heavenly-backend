import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or other email service (e.g., SendGrid, Mailgun)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
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
    console.error('❌ Error sending email:', error);
    throw error; // Re-throw the error to be handled by the controller
  }
};

export default sendEmail;
