const express = require("express");
const multer = require("multer");
const Post = require("../models/Post");
const User = require("../models/User");
const router = express.Router();
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save images in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a new post
router.post("/create", upload.single("media"), async (req, res) => {
  try {
    const { content, userId } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!content && !req.file) {
      return res.status(400).json({ message: "Content or media is required" });
    }

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      user: userId,
      content,
      media: mediaUrl,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Get all posts (Feed Page)
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

//  Get posts by user (Profile Page)
router.get("/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

module.exports = router;
