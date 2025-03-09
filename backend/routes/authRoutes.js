const express = require("express");
const cloudinary = require("cloudinary");
const {
  registerUser,
  LoginUser,
  getUserinfo,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// const upload = require("../middleware/uploadMiddleware");
// const { upload, uploadToCloudinary } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/getUser", protect, getUserinfo);

// const upload = uploadMiddleware("ImageAsserts")
// router.post('/upload-image', auth,upload.single('image'),uploadImage);

// router.post("/upload-image", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     // Upload file to Cloudinary
//     const imageUrl = await uploadToCloudinary(req.file.path);

//     res.status(200).json({ message: "Upload successful", url: imageUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error uploading file" });
//   }
// });

module.exports = router;
