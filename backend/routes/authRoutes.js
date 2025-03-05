const express = require("express");
const {
  registerUser,
  LoginUser,
  getUserinfo,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/getUser", protect, getUserinfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}s://${req.get("host")}/${req.file.filename}`;
  console.log(imageUrl);
  res.status(200).json({ imageUrl });
});

module.exports = router;
