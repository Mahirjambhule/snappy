// server/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will hash this later
    isAvatarImageSet: { type: Boolean, default: false },
    avatarImage: { type: String, default: "" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of friends
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt' automatically
);

module.exports = mongoose.model("User", UserSchema);