const { deleteFile } = require('../middleware/upload');
const path = require('path');

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private (Admin)
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'لم يتم اختيار ملف'
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            status: 'success',
            message: 'تم رفع الصورة بنجاح',
            data: {
                imageUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size
            }
        });
    } catch (error) {
        // Clean up uploaded file if something goes wrong
        if (req.file) {
            deleteFile(req.file.path);
        }
        next(error);
    }
};

// @desc    Delete image
// @route   DELETE /api/upload/image
// @access  Private (Admin)
const deleteImage = async (req, res, next) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                status: 'error',
                message: 'رابط الصورة مطلوب'
            });
        }

        // Extract filename from URL
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, '../../uploads', filename);

        // Delete file
        deleteFile(filePath);

        res.status(200).json({
            status: 'success',
            message: 'تم حذف الصورة بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage,
    deleteImage
}; 