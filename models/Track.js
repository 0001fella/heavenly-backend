const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  title: String,
  src: String,
  downloadLink: String,
  category: String,
  albumArt: String,
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
