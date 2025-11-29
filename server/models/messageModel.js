const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message: {
      // FIX: Explicitly setting required to FALSE
      text: { type: String, required: false }, 
      image: { type: String, default: "" },
    },
    users: Array,
    groupId: { type: String, default: null },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);