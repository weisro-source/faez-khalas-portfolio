const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({
            status: 'error',
            message: 'بيانات غير صحيحة',
            errors: errorMessages
        });
    }
    next();
};

// Project validation rules
const validateProject = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('اسم المشروع مطلوب')
        .isLength({ max: 100 })
        .withMessage('اسم المشروع يجب أن يكون أقل من 100 حرف'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('وصف المشروع مطلوب')
        .isLength({ max: 2000 })
        .withMessage('وصف المشروع يجب أن يكون أقل من 2000 حرف'),

    body('technologies')
        .optional()
        .isArray()
        .withMessage('التقنيات يجب أن تكون مصفوفة'),

    body('projectUrl')
        .optional()
        .isURL()
        .withMessage('رابط المشروع غير صحيح'),

    body('githubUrl')
        .optional()
        .isURL()
        .withMessage('رابط GitHub غير صحيح'),

    body('category')
        .optional()
        .isIn(['web', 'mobile', 'desktop', 'design', 'other'])
        .withMessage('فئة المشروع غير صحيحة'),

    body('status')
        .optional()
        .isIn(['completed', 'in-progress', 'planned'])
        .withMessage('حالة المشروع غير صحيحة'),

    body('featured')
        .optional()
        .isBoolean()
        .withMessage('قيمة المميز يجب أن تكون true أو false'),

    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('ترتيب المشروع يجب أن يكون رقماً موجباً'),

    handleValidationErrors
];

// Contact validation rules
const validateContact = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('الاسم مطلوب')
        .isLength({ max: 50 })
        .withMessage('الاسم يجب أن يكون أقل من 50 حرف'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('البريد الإلكتروني مطلوب')
        .isEmail()
        .withMessage('البريد الإلكتروني غير صحيح')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('رقم الهاتف مطلوب')
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('رقم الهاتف غير صحيح'),

    body('message')
        .trim()
        .notEmpty()
        .withMessage('الرسالة مطلوبة')
        .isLength({ max: 1000 })
        .withMessage('الرسالة يجب أن تكون أقل من 1000 حرف'),

    body('subject')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('الموضوع يجب أن يكون أقل من 100 حرف'),

    handleValidationErrors
];

// Admin login validation rules
const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('البريد الإلكتروني مطلوب')
        .isEmail()
        .withMessage('البريد الإلكتروني غير صحيح')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('كلمة المرور مطلوبة'),

    handleValidationErrors
];

// ID parameter validation
const validateId = [
    param('id')
        .isMongoId()
        .withMessage('معرف غير صحيح'),

    handleValidationErrors
];

// Query validation for pagination and search
const validateQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('رقم الصفحة يجب أن يكون رقماً موجباً'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('حد النتائج يجب أن يكون بين 1 و 100'),

    query('sort')
        .optional()
        .isIn(['createdAt', '-createdAt', 'name', '-name', 'order', '-order'])
        .withMessage('نوع الترتيب غير صحيح'),

    handleValidationErrors
];

// Contact status update validation
const validateContactStatus = [
    body('status')
        .notEmpty()
        .withMessage('الحالة مطلوبة')
        .isIn(['new', 'read', 'replied', 'archived'])
        .withMessage('حالة غير صحيحة'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('الملاحظات يجب أن تكون أقل من 500 حرف'),

    handleValidationErrors
];

module.exports = {
    validateProject,
    validateContact,
    validateLogin,
    validateId,
    validateQuery,
    validateContactStatus,
    handleValidationErrors
}; 