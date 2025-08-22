const Contact = require('../models/Contact');

// Helper function for pagination
const getPaginationData = (page = 1, limit = 10) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    return { pageNum, limitNum, skip };
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private (Admin)
const getAllContacts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            status,
            priority,
            isRead
        } = req.query;

        const { pageNum, limitNum, skip } = getPaginationData(page, limit);

        // Build filter object
        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (isRead !== undefined) filter.isRead = isRead === 'true';

        // Get contacts with pagination
        const contacts = await Contact.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const total = await Contact.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            status: 'success',
            data: {
                contacts,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalResults: total,
                    resultsPerPage: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private (Admin)
const getContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'الرسالة غير موجودة'
            });
        }

        // Mark as read if not already
        if (!contact.isRead) {
            contact.isRead = true;
            contact.readAt = new Date();
            await contact.save();
        }

        res.status(200).json({
            status: 'success',
            data: {
                contact
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new contact message
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res, next) => {
    try {
        // Add IP address and user agent
        const contactData = {
            ...req.body,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        };

        const contact = await Contact.create(contactData);

        res.status(201).json({
            status: 'success',
            message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً',
            data: {
                contact: {
                    _id: contact._id,
                    name: contact.name,
                    email: contact.email,
                    createdAt: contact.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update contact status
// @route   PATCH /api/contacts/:id/status
// @access  Private (Admin)
const updateContactStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                status,
                notes,
                ...(status === 'read' && { isRead: true, readAt: new Date() })
            },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'الرسالة غير موجودة'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'تم تحديث حالة الرسالة بنجاح',
            data: {
                contact
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
const deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'الرسالة غير موجودة'
            });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'تم حذف الرسالة بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private (Admin)
const getContactStats = async (req, res, next) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    unread: {
                        $sum: {
                            $cond: [{ $eq: ['$isRead', false] }, 1, 0]
                        }
                    },
                    new: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'new'] }, 1, 0]
                        }
                    },
                    replied: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'replied'] }, 1, 0]
                        }
                    },
                    archived: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'archived'] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const priorityStats = await Contact.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get contacts from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentContacts = await Contact.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const result = {
            total: stats[0]?.total || 0,
            unread: stats[0]?.unread || 0,
            new: stats[0]?.new || 0,
            replied: stats[0]?.replied || 0,
            archived: stats[0]?.archived || 0,
            recentContacts,
            priorityBreakdown: priorityStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        };

        res.status(200).json({
            status: 'success',
            data: {
                stats: result
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark contact as read
// @route   PATCH /api/contacts/:id/read
// @access  Private (Admin)
const markAsRead = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'الرسالة غير موجودة'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'تم تحديد الرسالة كمقروءة',
            data: {
                contact
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark contact as unread
// @route   PATCH /api/contacts/:id/unread
// @access  Private (Admin)
const markAsUnread = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                isRead: false,
                $unset: { readAt: 1 }
            },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                status: 'error',
                message: 'الرسالة غير موجودة'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'تم تحديد الرسالة كغير مقروءة',
            data: {
                contact
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unread contacts
// @route   GET /api/contacts/unread
// @access  Private (Admin)
const getUnreadContacts = async (req, res, next) => {
    try {
        const { limit = 5 } = req.query;

        const contacts = await Contact.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            status: 'success',
            data: {
                contacts,
                count: contacts.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search contacts
// @route   GET /api/contacts/search
// @access  Private (Admin)
const searchContacts = async (req, res, next) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                status: 'error',
                message: 'يرجى إدخال كلمة للبحث'
            });
        }

        const { pageNum, limitNum, skip } = getPaginationData(page, limit);

        const contacts = await Contact.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { message: { $regex: q, $options: 'i' } },
                { subject: { $regex: q, $options: 'i' } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Contact.countDocuments({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { message: { $regex: q, $options: 'i' } },
                { subject: { $regex: q, $options: 'i' } }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: {
                contacts,
                searchQuery: q,
                pagination: {
                    currentPage: pageNum,
                    totalResults: total,
                    resultsPerPage: limitNum
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
}; 