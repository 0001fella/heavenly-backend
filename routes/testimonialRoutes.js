import express from "express";
import Testimonial from "../models/Testimonial.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Email setup using your env config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (err) {
    console.error("❌ Error fetching testimonials:", err.message);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

// POST a new testimonial and send email
router.post("/", async (req, res) => {
  const { name, feedback, rating } = req.body;

  if (!name || !feedback || rating == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newTestimonial = new Testimonial({ name, feedback, rating });
    await newTestimonial.save();

    // Email to admin
    const mailOptions = {
      from: `"Heavenly Rhythms" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: "🎤 New Testimonial Submitted",
      html: `
        <h2>New Testimonial Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Rating:</strong> ${rating} / 5</p>
        <p><strong>Feedback:</strong></p>
        <blockquote>${feedback}</blockquote>
        <p>Log in to your dashboard or DB for full details.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email notification sent to admin.");

    res.status(201).json({ message: "Testimonial saved and email sent." });
  } catch (err) {
    console.error("❌ Error saving testimonial or sending email:", err.message);
    res
      .status(500)
      .json({ message: "Failed to save testimonial or send email." });
  }
});

export default router;
