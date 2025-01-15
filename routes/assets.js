// routes/assets.js

const express = require('express');
const router = express.Router();
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetsController');

// GET all assets
router.get('/', getAllAssets);

// GET a single asset by ID
router.get('/:id', getAssetById);

// POST create a new asset
router.post('/', createAsset);

// PUT update an asset by ID
router.put('/:id', updateAsset);

// DELETE an asset by ID
router.delete('/:id', deleteAsset);

module.exports = router;