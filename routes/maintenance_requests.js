const express = require('express');
const router = express.Router();
const maintenanceRequestsController = require('../controllers/maintenanceRequestsController');

// Define CRUD routes for maintenance requests
router.get('/', maintenanceRequestsController.getAllMaintenanceRequests);
router.get('/:id', maintenanceRequestsController.getMaintenanceRequestById);
router.post('/', maintenanceRequestsController.createMaintenanceRequest);
router.put('/:id', maintenanceRequestsController.updateMaintenanceRequest);
router.delete('/:id', maintenanceRequestsController.deleteMaintenanceRequest);

module.exports = router;
