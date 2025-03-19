const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, secure: true });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout User
router.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
});

// Get User Profile
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      coverPhoto: user.coverPhoto || "",
      bio: user.bio || "No bio available",
      work: user.work || "Not specified",
      education: user.education || "Not specified",
      interest: user.interest && user.interest.length > 0 ? user.interest : [],
      location: user.location || "Not specified",
      website: user.website || "",
      joinedDate: user.joinedDate
        ? user.joinedDate.toISOString().split("T")[0]
        : "Unknown",
      following: user.following || 0,
      followers: user.followers || 0,
      photos: user.photos && user.photos.length > 0 ? user.photos : [],
      friends: user.friends && user.friends.length > 0 ? user.friends : [],
      posts: user.posts && user.posts.length > 0 ? user.posts : [],
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ message: "Invalid token. Please log in again." });
  }
});

module.exports = router;
