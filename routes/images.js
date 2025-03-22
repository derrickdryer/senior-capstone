// routes/imageRoutes.js
const Router = require('koa-router');
const imagesController = require('../controllers/imagesController');

const router = new Router({
  prefix: '/api/images',
});

// READ: Get all images (optionally filtered by property_id or apartment_id)
router.get('/', imagesController.getImages);

// CREATE: Add a new image
router.post('/', imagesController.createImage);

// UPDATE: Update an existing image record
router.put('/:id', imagesController.updateImage);

// DELETE: Delete an image record
router.delete('/:id', imagesController.deleteImage);

module.exports = router;
