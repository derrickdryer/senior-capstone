// File purpose: Defines CRUD routes for asset management.
// Endpoints:
//   GET /      - Returns all assets
//   GET /:id   - Returns a specific asset by id
//   POST /     - Creates a new asset
//   PUT /:id   - Updates an existing asset by id
//   DELETE /:id - Deletes an asset by id

const Router = require('koa-router');
const assetsController = require('../controllers/assetsController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateAsset,
  validateUpdateAsset,
} = require('../middleware/validate');

const router = new Router({ prefix: '/api/assets' });

// GET all assets
router.get('/', assetsController.getAllAssets);

// GET asset by id
router.get('/:id', assetsController.getAssetById);

// Create a new asset
router.post(
  '/',
  authenticateToken,
  validateCreateAsset,
  assetsController.createAsset
);

// Update an existing asset
router.put(
  '/:id',
  authenticateToken,
  validateUpdateAsset,
  assetsController.updateAsset
);

// Delete an asset
router.delete('/:id', authenticateToken, assetsController.deleteAsset);

module.exports = router;
