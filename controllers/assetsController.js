// controllers/assetsController.js

const { assets } = require('../models/schemas');

// Get all assets
exports.getAllAssets = async (req, res) => {
  try {
    const results = await assets.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await assets.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new asset
exports.createAsset = async (req, res) => {
  try {
    const newAsset = await assets.create(req.body);
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing asset by ID
exports.updateAsset = async (req, res) => {
  try {
    const asset = await assets.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    await asset.update(req.body);
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an asset by ID
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await assets.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    await asset.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
