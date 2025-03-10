const express = require("express");

const router = express.Router();

const { uploadMiddleware } = require("../middleware/uploadMiddleware");

const upload = uploadMiddleware("ImageAsserts");

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log(req.file);

    res.status(200).json({
      message: "Upload successful",
      imageUrl: req.file.path || req.file.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong ${err}` });
  }
});

module.exports = router;
