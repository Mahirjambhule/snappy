const { addMessage, getMessages, deleteMessage } = require("../controllers/messageController");
const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require("../middlewares/authMiddleware");
require("dotenv").config();

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

router.post("/addmsg/", protect, addMessage);

router.post("/getmsg/", protect, getMessages);

router.post("/deletemsg/", protect, deleteMessage);

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