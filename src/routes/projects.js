const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { uploadProjectImages, handleMulterError } = require('../middleware/upload');
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
router.get('/', validateQuery, getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/search', searchProjects);
router.get('/:id', validateId, getProject);

// Protected routes (for admin only)
router.use(protect); // All routes below this middleware are protected

router.post('/',
    uploadProjectImages,
    handleMulterError,
    validateProject,
    createProject
);

router.put('/:id',
    validateId,
    uploadProjectImages,
    handleMulterError,
    validateProject,
    updateProject
);

router.delete('/:id', validateId, deleteProject);

router.patch('/:id/order', validateId, updateProjectOrder);
router.patch('/:id/status', validateId, toggleProjectStatus);

module.exports = router; 