const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم المشروع مطلوب'],
        trim: true,
        maxlength: [100, 'اسم المشروع يجب أن يكون أقل من 100 حرف']
    },
    description: {
        type: String,
        required: [true, 'وصف المشروع مطلوب'],
        trim: true,
        maxlength: [2000, 'وصف المشروع يجب أن يكون أقل من 2000 حرف']
    },
    coverImage: {
        type: String,
        required: [true, 'صورة الغلاف مطلوبة']
    },
    images: [{
        type: String,
        required: true
    }],
    technologies: [{
        type: String,
        trim: true
    }],
    projectUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'desktop', 'design', 'other'],
        default: 'web'
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'planned'],
        default: 'completed'
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better performance
projectSchema.index({ featured: -1, order: 1, createdAt: -1 });
projectSchema.index({ category: 1, isActive: 1 });
projectSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted creation date
projectSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('ar-SA');
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema); 