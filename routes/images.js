// routes/imageRoutes.js
const Router = require('koa-router');
const imagesController = require('../controllers/imagesController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateImage,
  validateUpdateImage,
} = require('../middleware/validate');

const router = new Router({
  prefix: '/api/images',
});

// READ: Get all images (optionally filtered by property_id or apartment_id)
router.get('/', imagesController.getImages);

// CREATE: Add a new image
router.post(
  '/',
  authenticateToken,
  validateCreateImage,
  imagesController.createImage
);

// UPDATE: Update an existing image record
router.put(
  '/:id',
  authenticateToken,
  validateUpdateImage,
  imagesController.updateImage
);

// DELETE: Delete an image record
router.delete('/:id', authenticateToken, imagesController.deleteImage);

module.exports = router;
