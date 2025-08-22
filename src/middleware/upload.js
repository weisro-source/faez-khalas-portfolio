const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureUploadDirs = () => {
    const dirs = [
        'uploads',
        'uploads/projects',
        'uploads/projects/covers',
        'uploads/projects/gallery'
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

ensureUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';

        if (file.fieldname === 'coverImage') {
            uploadPath += 'projects/covers/';
        } else if (file.fieldname === 'images') {
            uploadPath += 'projects/gallery/';
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, name);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('يُسمح فقط بملفات الصور'), false);
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
        files: 10 // Maximum 10 files
    }
});

// Middleware for project images
const uploadProjectImages = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 8 }
]);

// Middleware for single image upload
const uploadSingleImage = upload.single('image');

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                status: 'error',
                message: 'عدد الملفات كبير جداً'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: 'حقل الملف غير متوقع'
            });
        }
    }

    if (err.message === 'يُسمح فقط بملفات الصور') {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    next(err);
};

// Helper function to delete file
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

// Helper function to delete multiple files
const deleteFiles = (filePaths) => {
    filePaths.forEach(filePath => {
        deleteFile(filePath);
    });
};

module.exports = {
    uploadProjectImages,
    uploadSingleImage,
    handleMulterError,
    deleteFile,
    deleteFiles
}; 