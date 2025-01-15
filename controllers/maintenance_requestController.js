// controllers/maintenanceRequestsController.js

const { maintenance_requests } = require('../models');

// Get all maintenance requests
exports.getAllMaintenanceRequests = async (req, res) => {
  try {
    const results = await maintenance_requests.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single maintenance request by ID
exports.getMaintenanceRequestById = async (req, res) => {
  try {
    const request = await maintenance_requests.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new maintenance request
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const newRequest = await maintenance_requests.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing maintenance request by ID
exports.updateMaintenanceRequest = async (req, res) => {
  try {
    const request = await maintenance_requests.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });

    await request.update(req.body);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a maintenance request by ID
exports.deleteMaintenanceRequest = async (req, res) => {
  try {
    const request = await maintenance_requests.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });

    await request.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};