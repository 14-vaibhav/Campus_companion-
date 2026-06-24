const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const adminMiddleware = require('../middleware/adminMiddleware');

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus_companion',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
  }
});

const upload = multer({ storage: storage });

/**
 * POST /api/upload
 * Accepts a multipart/form-data request with an 'image' field containing the file.
 * Requires admin access.
 */
router.post('/', adminMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // multer-storage-cloudinary populates path/secure_url with the Cloudinary resource URL
    const fileUrl = req.file.path || req.file.secure_url;
    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
