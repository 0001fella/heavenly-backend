import sendEmail from '../Utils/sendEmail.js';


// Function to handle sending contact messages
export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Simple validation
  if (![name, email, message].every(Boolean)) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // Email validation using regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    // Optional: Send email to admin or contact
    const adminMessage = `
      New Contact Message:
      - Name: ${name}
      - Email: ${email}
      - Message: ${message}
    `;

    await sendEmail(process.env.ADMIN_EMAIL, '📥 New Contact Message', adminMessage);

    // For now, log the message (optional for debugging purposes)
    console.log('Received contact message:', { name, email, message });

    // Respond with success message
    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ message: 'Something went wrong while processing your request. Please try again later.' });
  }
};
