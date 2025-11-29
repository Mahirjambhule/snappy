const { addMessage, getMessages, deleteMessage } = require("../controllers/messageController");
const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require("../middlewares/authMiddleware"); // <--- THIS WAS MISSING
require("dotenv").config();

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "snappy-chat",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. Add Message (Protected)
router.post("/addmsg/", protect, addMessage);

// 2. Get Messages (Protected)
router.post("/getmsg/", protect, getMessages);

// 3. Delete Message (Protected)
router.post("/deletemsg/", protect, deleteMessage);

// 4. Upload Image (Protected)
router.post("/uploadimage", protect, upload.single("image"), (req, res) => {
  try {
    return res.json({ 
        status: true, 
        imageUrl: req.file.path 
    });
  } catch (error) {
    console.error(error);
    return res.json({ status: false, msg: "Image upload failed" });
  }
});

module.exports = router;