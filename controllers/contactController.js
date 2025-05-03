// controllers/contactController.js

// Function to handle sending contact messages
export const sendMessage = (req, res) => {
    const { name, email, message } = req.body;
  
    // Simple validation (you can expand this)
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
  
    // Here you would normally handle sending the message (e.g., saving to a database, sending an email, etc.)
    console.log('Received message:', { name, email, message });
  
    // Respond with success message
    res.status(200).json({ message: 'Message sent successfully' });
  };
  