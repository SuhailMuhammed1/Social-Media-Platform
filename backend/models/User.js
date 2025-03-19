const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    bio: { type: String, default: "No bio available." },
    work: { type: String, default: "Not specified" },
    education: { type: String, default: "Not specified" },
    interest: { type: [String], default: [] },
    location: { type: String, default: "Not specified" },
    website: { type: String, default: "" },
    joinedDate: { type: Date, default: Date.now },
    following: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    photos: { type: [String], default: [] },
    friends: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        avatar: { type: String, default: "https://via.placeholder.com/100" },
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
