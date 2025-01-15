// routes/maintenance_requests.js

const express = require('express');
const router = express.Router();
const {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest
} = require('../controllers/maintenanceRequestsController');

// GET all maintenance requests
router.get('/', getAllMaintenanceRequests);

// GET a single maintenance request by ID
router.get('/:id', getMaintenanceRequestById);

// POST create a new maintenance request
router.post('/', createMaintenanceRequest);

// PUT update a maintenance request by ID
router.put('/:id', updateMaintenanceRequest);

// DELETE a maintenance request by ID
router.delete('/:id', deleteMaintenanceRequest);

module.exports = router;