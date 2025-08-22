/**
 * Image URL utilities for API responses
 */

/**
 * Get the base URL for the current request
 * @param {Object} req - Express request object
 * @returns {String} Base URL
 */
const getBaseUrl = (req) => {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}`;
};

/**
 * Convert relative image path to full URL
 * @param {String} imagePath - Relative image path (e.g., "/uploads/image.jpg")
 * @param {String} baseUrl - Base URL
 * @returns {String} Full image URL
 */
const getFullImageUrl = (imagePath, baseUrl) => {
    if (!imagePath) return null;

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    const fullUrl = `${baseUrl}/${cleanPath}`;
    console.log('🔧 Transforming image path:', imagePath, '→', fullUrl);

    return fullUrl;
};

/**
 * Transform a project object to include full image URLs
 * @param {Object} project - Project object
 * @param {String} baseUrl - Base URL
 * @returns {Object} Project with full image URLs
 */
const transformProjectImages = (project, baseUrl) => {
    const projectObj = project.toObject ? project.toObject() : project;

    return {
        ...projectObj,
        coverImage: getFullImageUrl(projectObj.coverImage, baseUrl),
        images: projectObj.images ? projectObj.images.map(img => getFullImageUrl(img, baseUrl)) : []
    };
};

/**
 * Transform an array of projects to include full image URLs
 * @param {Array} projects - Array of project objects
 * @param {String} baseUrl - Base URL
 * @returns {Array} Projects with full image URLs
 */
const transformProjectsImages = (projects, baseUrl) => {
    return projects.map(project => transformProjectImages(project, baseUrl));
};

/**
 * Middleware to add image transformation utilities to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const addImageUtils = (req, res, next) => {
    const baseUrl = getBaseUrl(req);

    console.log('🔧 ImageUtils Middleware - Base URL:', baseUrl);

    // Add utilities to request object
    req.imageUtils = {
        baseUrl,
        getFullImageUrl: (imagePath) => getFullImageUrl(imagePath, baseUrl),
        transformProject: (project) => transformProjectImages(project, baseUrl),
        transformProjects: (projects) => transformProjectsImages(projects, baseUrl)
    };

    next();
};

/**
 * Transform any object that contains image paths
 * @param {Object} obj - Object to transform
 * @param {String} baseUrl - Base URL
 * @param {Array} imageFields - Array of field names that contain image paths
 * @returns {Object} Transformed object
 */
const transformObjectImages = (obj, baseUrl, imageFields = []) => {
    const transformed = { ...obj };

    imageFields.forEach(field => {
        if (transformed[field]) {
            if (Array.isArray(transformed[field])) {
                transformed[field] = transformed[field].map(img => getFullImageUrl(img, baseUrl));
            } else {
                transformed[field] = getFullImageUrl(transformed[field], baseUrl);
            }
        }
    });

    return transformed;
};

module.exports = {
    getBaseUrl,
    getFullImageUrl,
    transformProjectImages,
    transformProjectsImages,
    addImageUtils,
    transformObjectImages
}; 