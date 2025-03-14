const Router = require('koa-router');
const leasesController = require('../controllers/leasesController');
const { authenticateToken } = require('../middleware/auth');

const router = new Router();

// Apply JWT authentication to all routes in this router
router.use(authenticateToken);

// Define CRUD routes for leases
router.get('/', leasesController.getAllLeases);
router.get('/:id', leasesController.getLeaseById);
router.post('/', leasesController.createLease);
router.put('/:id', leasesController.updateLease);
router.delete('/:id', leasesController.deleteLease);

module.exports = router;
