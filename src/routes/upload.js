const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadSingleImage, handleMulterError } = require('../middleware/upload');

const {
    uploadImage,
    deleteImage
} = require('../controllers/uploadController');

// Protected routes (admin only)
router.use(protect);

router.post('/image', uploadSingleImage, handleMulterError, uploadImage);
router.delete('/image', deleteImage);

module.exports = router; 