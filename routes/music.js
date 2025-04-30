const express = require("express");
const Track = require("../models/Track");

const router = express.Router();

// Get all tracks with optional filters for search query and category
router.get("/tracks", async (req, res) => {
  try {
    const { searchQuery, selectedCategory } = req.query;
    let filter = {};

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (selectedCategory && selectedCategory !== "All") {
      filter.category = selectedCategory;
    }

    const tracks = await Track.find(filter);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tracks" });
  }
});

// Add a track (for admin purposes)
router.post("/tracks", async (req, res) => {
  try {
    const newTrack = new Track(req.body);
    await newTrack.save();
    res.status(201).json(newTrack);
  } catch (err) {
    res.status(500).json({ message: "Error adding track" });
  }
});

module.exports = router;
