const express = require("express");

const router = express.Router();

const { uploadMiddleware } = require("../middleware/uploadMiddleware");

const upload = uploadMiddleware("ImageAsserts");
router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  res.json({ message: "Upload successful", url: req.file.path });
});

module.exports = router;
