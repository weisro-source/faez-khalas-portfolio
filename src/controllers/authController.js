const Admin = require('../models/Admin');
const { createSendToken } = require('../middleware/auth');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'بيانات دخول غير صحيحة'
            });
        }

        // Check if account is locked
        if (admin.isLocked) {
            return res.status(423).json({
                status: 'error',
                message: 'الحساب مقفل مؤقتاً بسبب محاولات دخول فاشلة متعددة'
            });
        }

        // Check if account is active
        if (!admin.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'الحساب غير مفعل'
            });
        }

        // Check password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            // Increment login attempts
            await admin.incLoginAttempts();

            return res.status(401).json({
                status: 'error',
                message: 'بيانات دخول غير صحيحة'
            });
        }

        // Reset login attempts on successful login
        if (admin.loginAttempts > 0) {
            await admin.resetLoginAttempts();
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Create and send token
        createSendToken(admin, 200, res);

    } catch (error) {
        next(error);
    }
};

// @desc    Get current admin info
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        res.status(200).json({
            status: 'success',
            data: {
                admin
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin profile
// @route   PATCH /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        // Check if email is already taken by another admin
        if (email && email !== req.admin.email) {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({
                    status: 'error',
                    message: 'البريد الإلكتروني مستخدم مسبقاً'
                });
            }
        }

        const admin = await Admin.findByIdAndUpdate(
            req.admin._id,
            { name, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'تم تحديث البيانات بنجاح',
            data: {
                admin
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change admin password
// @route   PATCH /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'جميع الحقول مطلوبة'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'كلمة المرور الجديدة وتأكيدها غير متطابقتان'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'
            });
        }

        // Get admin with password
        const admin = await Admin.findById(req.admin._id).select('+password');

        // Check current password
        const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'كلمة المرور الحالية غير صحيحة'
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            status: 'success',
            message: 'تم تغيير كلمة المرور بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create default admin (for initial setup)
// @route   POST /api/auth/setup
// @access  Public (Only if no admin exists)
const createDefaultAdmin = async (req, res, next) => {
    try {
        // Check if any admin already exists
        const existingAdmin = await Admin.findOne();

        if (existingAdmin) {
            return res.status(400).json({
                status: 'error',
                message: 'يوجد مشرف بالفعل. لا يمكن إنشاء مشرف جديد'
            });
        }

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'جميع الحقول مطلوبة'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'
            });
        }

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password,
            role: 'super-admin'
        });

        createSendToken(admin, 201, res, 'تم إنشاء حساب المشرف بنجاح');

    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    getMe,
    updateProfile,
    changePassword,
    createDefaultAdmin
}; 