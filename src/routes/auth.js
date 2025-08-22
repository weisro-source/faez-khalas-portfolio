const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validators');

const {
    login,
    getMe,
    updateProfile,
    changePassword,
    createDefaultAdmin
} = require('../controllers/authController');

// Public routes
router.post('/login', validateLogin, login);
router.post('/setup', createDefaultAdmin); // For initial setup only

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);

module.exports = router; 