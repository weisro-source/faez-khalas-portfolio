const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        trim: true,
        maxlength: [50, 'الاسم يجب أن يكون أقل من 50 حرف']
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'يرجى إدخال بريد إلكتروني صحيح'
        ]
    },
    phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        trim: true,
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'يرجى إدخال رقم هاتف صحيح'
        ]
    },
    message: {
        type: String,
        required: [true, 'الرسالة مطلوبة'],
        trim: true,
        maxlength: [1000, 'الرسالة يجب أن تكون أقل من 1000 حرف']
    },
    subject: {
        type: String,
        trim: true,
        maxlength: [100, 'الموضوع يجب أن يكون أقل من 100 حرف']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    source: {
        type: String,
        enum: ['website', 'social', 'referral', 'other'],
        default: 'website'
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'الملاحظات يجب أن تكون أقل من 500 حرف']
    }
}, {
    timestamps: true
});

// Index for better performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ isRead: 1, createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });

// Text index for search
contactSchema.index({
    name: 'text',
    email: 'text',
    message: 'text',
    subject: 'text'
});

// Virtual for formatted creation date
contactSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('ar-SA');
});

// Virtual for formatted read date
contactSchema.virtual('formattedReadDate').get(function () {
    return this.readAt ? this.readAt.toLocaleDateString('ar-SA') : null;
});

// Pre-save middleware to set readAt when status changes to read
contactSchema.pre('save', function (next) {
    if (this.isModified('isRead') && this.isRead && !this.readAt) {
        this.readAt = new Date();
    }
    next();
});

// Ensure virtual fields are serialized
contactSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema); 