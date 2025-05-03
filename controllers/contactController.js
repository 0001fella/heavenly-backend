const ContactMessage = require("../models/ContactMessage");

const submitMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message received successfully" });
  } catch (err) {
    console.error("Contact submission failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { submitMessage };
