const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const groupRoutes = require("./routes/groups");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

// --- 1. ALLOWED ORIGINS ---
const allowedOrigins = [
  "http://localhost:5173",                // Local React
  "https://snappy-woad.vercel.app"        // Deployed Vercel App
];

// --- 2. EXPRESS CORS ---
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connetion Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Server Started on Port ${process.env.PORT || 3001}`);
});

// --- 3. SOCKET.IO CORS ---
const io = socket(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowed list
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("user-online", userId);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        msg: data.msg,
        image: data.image 
      });
    }
  });

  socket.on("delete-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-deleted", data.msgId);
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUserId;
    for (let [id, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = id;
        break;
      }
    }
    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      io.emit("user-offline", disconnectedUserId);
    }
  });
});