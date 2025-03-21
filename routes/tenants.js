// File purpose: Defines CRUD routes for tenant management.
// Endpoints:
//   GET /      - Returns all tenants
//   GET /:id   - Returns a specific tenant by id
//   POST /     - Creates a new tenant
//   PUT /:id   - Updates an existing tenant by id
//   DELETE /:id - Deletes a tenant

const Router = require('koa-router');
const tenantsController = require('../controllers/tenantsController');
const { authenticateToken } = require('../middleware/auth');

const router = new Router({ prefix: '/api/tenants' });

router.use(authenticateToken);

// GET all tenants
router.get('/', tenantsController.getAllTenants);

// GET tenant by id
router.get('/:id', tenantsController.getTenantById);

// Create a new tenant
router.post('/', tenantsController.createTenant);

// Update an existing tenant
router.put('/:id', tenantsController.updateTenant);

// Delete a tenant
router.delete('/:id', tenantsController.deleteTenant);

module.exports = router;
