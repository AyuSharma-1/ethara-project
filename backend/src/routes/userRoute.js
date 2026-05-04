const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

// Search users by email (for adding members)
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter required" });
    }

    const users = await User.find({
      email: { $regex: email, $options: "i" },
    })
      .select("username email _id")
      .limit(10);

    res.status(200).json({ message: "Users found", users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
