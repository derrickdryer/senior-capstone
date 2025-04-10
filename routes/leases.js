// File purpose: Defines secured CRUD routes for lease management using JWT authentication.
// Endpoints:
//   GET /      - Returns all leases
//   GET /:id   - Returns a specific lease by id
//   POST /     - Creates a new lease
//   PUT /:id   - Updates an existing lease by id
//   DELETE /:id - Deletes a lease

const Router = require('koa-router');
const leasesController = require('../controllers/leasesController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateLease,
  validateUpdateLease,
} = require('../middleware/validate');

const router = new Router({ prefix: '/api/leases' });

// Apply JWT authentication to all routes in this router
router.use(authenticateToken);

// GET all leases
router.get('/', leasesController.getAllLeases);

// Get all leases by user id with join controlleer
router.get(
  '/user/:id',
  leasesController.getAllLeasesWithTenantDetails,
  authenticateToken
);

// GET lease by id
router.get('/:id', leasesController.getLeaseById);

router.get('/detailed/:id', leasesController.getLeaseByIdDetailed);

// Create a new lease
router.post('/', validateCreateLease, leasesController.createLease);

// Update an existing lease
router.put('/:id', validateUpdateLease, leasesController.updateLease);

// Delete a lease
router.delete('/:id', leasesController.deleteLease);

module.exports = router;
