// routes/tenants.js

const express = require('express');
const router = express.Router();
const {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant
} = require('../controllers/tenantsController');

// GET all tenants
router.get('/', getAllTenants);

// GET a single tenant by ID
router.get('/:id', getTenantById);

// POST create a new tenant
router.post('/', createTenant);

// PUT update a tenant by ID
router.put('/:id', updateTenant);

// DELETE a tenant by ID
router.delete('/:id', deleteTenant);

module.exports = router;