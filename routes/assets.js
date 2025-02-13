const Router = require('koa-router');
const assetsController = require('../controllers/assetsController');

const router = new Router();

// Define CRUD routes for assets
router.get('/', assetsController.getAllAssets);
router.get('/:id', assetsController.getAssetById);
router.post('/', assetsController.createAsset);
router.put('/:id', assetsController.updateAsset);
router.delete('/:id', assetsController.deleteAsset);

module.exports = router;
