const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error('Error:', err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'المورد غير موجود';
        return res.status(404).json({
            status: 'error',
            message
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `${field} "${value}" موجود مسبقاً`;
        return res.status(400).json({
            status: 'error',
            message
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({
            status: 'error',
            message
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'رمز غير صحيح، الرجاء تسجيل الدخول مرة أخرى';
        return res.status(401).json({
            status: 'error',
            message
        });
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'انتهت صلاحية الرمز، الرجاء تسجيل الدخول مرة أخرى';
        return res.status(401).json({
            status: 'error',
            message
        });
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        const message = 'حجم الملف كبير جداً';
        return res.status(400).json({
            status: 'error',
            message
        });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        const message = 'عدد الملفات كبير جداً';
        return res.status(400).json({
            status: 'error',
            message
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const message = 'نوع الملف غير مدعوم';
        return res.status(400).json({
            status: 'error',
            message
        });
    }

    // Default error
    res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'خطأ في الخادم',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 