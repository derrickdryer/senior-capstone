const express = require('express');
const router = express.Router();
const tenantsController = require('../controllers/tenantsController');

// Define CRUD routes for tenants
router.get('/', tenantsController.getAllTenants);
router.get('/:id', tenantsController.getTenantById);
router.post('/', tenantsController.createTenant);
router.put('/:id', tenantsController.updateTenant);
router.delete('/:id', tenantsController.deleteTenant);

module.exports = router;
