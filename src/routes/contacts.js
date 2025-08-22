const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const {
    validateContact,
    validateId,
    validateQuery,
    validateContactStatus
} = require('../middleware/validators');

const {
    getAllContacts,
    getContact,
    createContact,
    updateContactStatus,
    deleteContact,
    getContactStats,
    markAsRead,
    markAsUnread,
    getUnreadContacts,
    searchContacts
} = require('../controllers/contactController');

// Public routes (for website visitors)
router.post('/', validateContact, createContact);

// Protected routes (for admin only)
router.use(protect); // All routes below this middleware are protected

router.get('/', validateQuery, getAllContacts);
router.get('/stats', getContactStats);
router.get('/unread', getUnreadContacts);
router.get('/search', searchContacts);
router.get('/:id', validateId, getContact);

router.patch('/:id/status', validateId, validateContactStatus, updateContactStatus);
router.patch('/:id/read', validateId, markAsRead);
router.patch('/:id/unread', validateId, markAsUnread);

router.delete('/:id', validateId, deleteContact);

module.exports = router; 