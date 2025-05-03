const express = require("express");
const router = express.Router();
const { submitMessage } = require("../controllers/contactController");

router.post("/contact", submitMessage);

module.exports = router;
