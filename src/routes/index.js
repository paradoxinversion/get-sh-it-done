const express = require("express");
const router = express.Router();

// Main Index Route
router.get("/", (req, res) => {
  console.log('wat')
  res.render("index");
});

module.exports = router;
