const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadProjectImages, handleMulterError } = require('../middleware/upload');
const { addImageUtils } = require('../utils/imageUtils');
const {
    validateProject,
    validateId,
    validateQuery
} = require('../middleware/validators');

const {
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
} = require('../controllers/projectController');

// Public routes (for website visitors)
router.get('/', validateQuery, addImageUtils, getAllProjects);
router.get('/featured', addImageUtils, getFeaturedProjects);
router.get('/category/:category', addImageUtils, getProjectsByCategory);
router.get('/search', addImageUtils, searchProjects);
router.get('/:id', validateId, addImageUtils, getProject);

// Protected routes (for admin only)
router.use(protect); // All routes below this middleware are protected

router.post('/',
    uploadProjectImages,
    handleMulterError,
    validateProject,
    addImageUtils,
    createProject
);

router.put('/:id',
    validateId,
    uploadProjectImages,
    handleMulterError,
    validateProject,
    addImageUtils,
    updateProject
);

router.delete('/:id', validateId, deleteProject);

router.patch('/:id/order', validateId, updateProjectOrder);
router.patch('/:id/status', validateId, toggleProjectStatus);

module.exports = router; 