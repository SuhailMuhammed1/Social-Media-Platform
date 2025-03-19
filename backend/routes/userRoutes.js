const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Multer storage configuration for file uploads (avatars & cover photos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store in `uploads/` folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ **Update User Profile**
router.put(
  "/users/:id",
  verifyToken,
  upload.fields([{ name: "avatar" }, { name: "coverPhoto" }]),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, bio, location, website, work, education, interest } =
        req.body;

      // Find the user
      let user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Update fields
      user.name = name || user.name;
      user.bio = bio || user.bio;
      user.location = location || user.location;
      user.website = website || user.website;
      user.work = work || user.work;
      user.education = education || user.education;
      user.interest = interest
        ? interest.split(",").map((i) => i.trim())
        : user.interest;

      // Save user data
      await user.save();

      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
