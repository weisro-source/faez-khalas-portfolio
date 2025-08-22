const Project = require('../models/Project');
const { deleteFile, deleteFiles } = require('../middleware/upload');
const path = require('path');

// Helper function for pagination
const getPaginationData = (page = 1, limit = 10) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    return { pageNum, limitNum, skip };
};

// Helper function to process uploaded files
const processUploadedFiles = (files) => {
    const result = {};

    if (files.coverImage && files.coverImage[0]) {
        result.coverImage = `/uploads/projects/covers/${files.coverImage[0].filename}`;
    }

    if (files.images && files.images.length > 0) {
        result.images = files.images.map(file =>
            `/uploads/projects/gallery/${file.filename}`
        );
    }

    return result;
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt', category, status, featured } = req.query;
        const { pageNum, limitNum, skip } = getPaginationData(page, limit);

        // Build filter object
        const filter = { isActive: true };

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (featured !== undefined) filter.featured = featured === 'true';

        // Get projects with pagination
        const projects = await Project.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const total = await Project.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            status: 'success',
            data: {
                projects,
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

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
const getFeaturedProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            featured: true,
            isActive: true
        }).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: {
                projects
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
const getProjectsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
        const { pageNum, limitNum, skip } = getPaginationData(page, limit);

        const projects = await Project.find({
            category,
            isActive: true
        })
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const total = await Project.countDocuments({ category, isActive: true });
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            status: 'success',
            data: {
                projects,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalResults: total,
                    resultsPerPage: limitNum
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search projects
// @route   GET /api/projects/search
// @access  Public
const searchProjects = async (req, res, next) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                status: 'error',
                message: 'يرجى إدخال كلمة للبحث'
            });
        }

        const { pageNum, limitNum, skip } = getPaginationData(page, limit);

        const projects = await Project.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { description: { $regex: q, $options: 'i' } },
                        { technologies: { $in: [new RegExp(q, 'i')] } }
                    ]
                }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Project.countDocuments({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { description: { $regex: q, $options: 'i' } },
                        { technologies: { $in: [new RegExp(q, 'i')] } }
                    ]
                }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: {
                projects,
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

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'المشروع غير موجود'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = async (req, res, next) => {
    try {
        // Process uploaded files
        const uploadedFiles = processUploadedFiles(req.files);

        // Check if cover image is uploaded
        if (!uploadedFiles.coverImage) {
            return res.status(400).json({
                status: 'error',
                message: 'صورة الغلاف مطلوبة'
            });
        }

        // Parse technologies if it's a string
        if (req.body.technologies && typeof req.body.technologies === 'string') {
            try {
                req.body.technologies = JSON.parse(req.body.technologies);
            } catch (error) {
                req.body.technologies = req.body.technologies.split(',').map(tech => tech.trim());
            }
        }

        // Create project data
        const projectData = {
            ...req.body,
            ...uploadedFiles
        };

        const project = await Project.create(projectData);

        res.status(201).json({
            status: 'success',
            message: 'تم إنشاء المشروع بنجاح',
            data: {
                project
            }
        });
    } catch (error) {
        // Clean up uploaded files if project creation fails
        if (req.files) {
            const filesToDelete = [];
            if (req.files.coverImage) {
                filesToDelete.push(...req.files.coverImage.map(file => file.path));
            }
            if (req.files.images) {
                filesToDelete.push(...req.files.images.map(file => file.path));
            }
            deleteFiles(filesToDelete);
        }
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'المشروع غير موجود'
            });
        }

        // Store old file paths for cleanup
        const oldCoverImage = project.coverImage;
        const oldImages = [...project.images];

        // Process uploaded files
        const uploadedFiles = processUploadedFiles(req.files);

        // Parse technologies if it's a string
        if (req.body.technologies && typeof req.body.technologies === 'string') {
            try {
                req.body.technologies = JSON.parse(req.body.technologies);
            } catch (error) {
                req.body.technologies = req.body.technologies.split(',').map(tech => tech.trim());
            }
        }

        // Update project data
        const updateData = { ...req.body };

        // Update cover image if new one is uploaded
        if (uploadedFiles.coverImage) {
            updateData.coverImage = uploadedFiles.coverImage;
        }

        // Update images if new ones are uploaded
        if (uploadedFiles.images) {
            if (req.body.replaceImages === 'true') {
                // Replace all images
                updateData.images = uploadedFiles.images;
            } else {
                // Add to existing images
                updateData.images = [...project.images, ...uploadedFiles.images];
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        // Clean up old files if they were replaced
        if (uploadedFiles.coverImage && oldCoverImage) {
            deleteFile(path.join(__dirname, '../../', oldCoverImage));
        }

        if (uploadedFiles.images && req.body.replaceImages === 'true') {
            oldImages.forEach(imagePath => {
                deleteFile(path.join(__dirname, '../../', imagePath));
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'تم تحديث المشروع بنجاح',
            data: {
                project: updatedProject
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'المشروع غير موجود'
            });
        }

        // Delete associated files
        const filesToDelete = [];

        if (project.coverImage) {
            filesToDelete.push(path.join(__dirname, '../../', project.coverImage));
        }

        if (project.images && project.images.length > 0) {
            project.images.forEach(imagePath => {
                filesToDelete.push(path.join(__dirname, '../../', imagePath));
            });
        }

        deleteFiles(filesToDelete);

        // Delete project from database
        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'تم حذف المشروع بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update project order
// @route   PATCH /api/projects/:id/order
// @access  Private (Admin)
const updateProjectOrder = async (req, res, next) => {
    try {
        const { order } = req.body;

        if (order === undefined || order < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'ترتيب المشروع يجب أن يكون رقماً موجباً'
            });
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { order: parseInt(order) },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'المشروع غير موجود'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'تم تحديث ترتيب المشروع بنجاح',
            data: {
                project
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle project active status
// @route   PATCH /api/projects/:id/status
// @access  Private (Admin)
const toggleProjectStatus = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'المشروع غير موجود'
            });
        }

        project.isActive = !project.isActive;
        await project.save();

        res.status(200).json({
            status: 'success',
            message: `تم ${project.isActive ? 'تفعيل' : 'إلغاء تفعيل'} المشروع بنجاح`,
            data: {
                project
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getFeaturedProjects,
    getProjectsByCategory,
    searchProjects,
    updateProjectOrder,
    toggleProjectStatus
}; 