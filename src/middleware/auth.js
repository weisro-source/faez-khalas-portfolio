const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'غير مخول للوصول، الرجاء تسجيل الدخول'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from token
            const admin = await Admin.findById(decoded.id).select('-password');

            if (!admin) {
                return res.status(401).json({
                    status: 'error',
                    message: 'المستخدم غير موجود'
                });
            }

            if (!admin.isActive) {
                return res.status(401).json({
                    status: 'error',
                    message: 'الحساب غير مفعل'
                });
            }

            if (admin.isLocked) {
                return res.status(401).json({
                    status: 'error',
                    message: 'الحساب مقفل مؤقتاً'
                });
            }

            // Add admin to request
            req.admin = admin;
            next();

        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'رمز غير صحيح'
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'خطأ في الخادم'
        });
    }
};

// Middleware to restrict to certain roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'ليس لديك صلاحية للوصول إلى هذا المورد'
            });
        }
        next();
    };
};

// Generate JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Create and send token response
const createSendToken = (admin, statusCode, res, message = 'تم تسجيل الدخول بنجاح') => {
    const token = signToken(admin._id);

    // Remove password from output
    admin.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: {
            admin
        }
    });
};

module.exports = {
    protect,
    restrictTo,
    signToken,
    createSendToken
}; 