// controllers/tenantsController.js

const { tenants } = require('../models/schemas');

// Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    const results = await tenants.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single tenant by ID
exports.getTenantById = async (req, res) => {
  try {
    const tenant = await tenants.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new tenant
exports.createTenant = async (req, res) => {
  try {
    const newTenant = await tenants.create(req.body);
    res.status(201).json(newTenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing tenant by ID
exports.updateTenant = async (req, res) => {
  try {
    const tenant = await tenants.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    await tenant.update(req.body);
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a tenant by ID
exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await tenants.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    await tenant.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
