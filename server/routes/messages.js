const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "snappy-chat", // The folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowed file types
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

// 3. Upload Route (Updated)
router.post("/uploadimage", upload.single("image"), (req, res) => {
  try {
    // Cloudinary automatically puts the URL in req.file.path
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