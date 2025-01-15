// controllers/leasesController.js

const { leases } = require('../models');

// Get all leases
exports.getAllLeases = async (req, res) => {
  try {
    const results = await leases.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single lease by ID
exports.getLeaseById = async (req, res) => {
  try {
    const lease = await leases.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ error: 'Lease not found' });
    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new lease
exports.createLease = async (req, res) => {
  try {
    const newLease = await leases.create(req.body);
    res.status(201).json(newLease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing lease by ID
exports.updateLease = async (req, res) => {
  try {
    const lease = await leases.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ error: 'Lease not found' });

    await lease.update(req.body);
    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a lease by ID
exports.deleteLease = async (req, res) => {
  try {
    const lease = await leases.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ error: 'Lease not found' });

    await lease.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};