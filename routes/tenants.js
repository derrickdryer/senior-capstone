const Router = require('koa-router');
const tenantsController = require('../controllers/tenantsController');

const router = new Router();

// Define CRUD routes for tenants
router.get('/', tenantsController.getAllTenants);
router.get('/:id', tenantsController.getTenantById);
router.post('/', tenantsController.createTenant);
router.put('/:id', tenantsController.updateTenant);
router.delete('/:id', tenantsController.deleteTenant);

module.exports = router;
