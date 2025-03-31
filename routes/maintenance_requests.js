// File purpose: Defines CRUD routes for maintenance request management.
// Endpoints:
//   GET /      - Returns all maintenance requests
//   GET /:id   - Returns a specific maintenance request by id
//   POST /     - Creates a new maintenance request
//   PUT /:id   - Updates an existing maintenance request by id
//   DELETE /:id - Deletes a maintenance request

const Router = require('koa-router');
const maintenanceRequestsController = require('../controllers/maintenanceRequestsController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateMaintenanceRequest,
  validateUpdateMaintenanceRequest,
} = require('../middleware/validate');

const router = new Router({ prefix: '/api/maintenance-requests' });

router.use(authenticateToken);

// GET all maintenance requests
router.get('/', maintenanceRequestsController.getAllMaintenanceRequests);

// GET maintenance request by id
router.get('/:id', maintenanceRequestsController.getMaintenanceRequestById);

// Create a new maintenance request
router.post(
  '/',
  validateCreateMaintenanceRequest,
  maintenanceRequestsController.createMaintenanceRequest
);

// Update an existing maintenance request
router.put(
  '/:id',
  validateUpdateMaintenanceRequest,
  maintenanceRequestsController.updateMaintenanceRequest
);

// Delete a maintenance request
router.delete('/:id', maintenanceRequestsController.deleteMaintenanceRequest);

module.exports = router;
