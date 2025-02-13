const Router = require('koa-router');
const leasesController = require('../controllers/leasesController');

const router = new Router();

// Define CRUD routes for leases
router.get('/', leasesController.getAllLeases);
router.get('/:id', leasesController.getLeaseById);
router.post('/', leasesController.createLease);
router.put('/:id', leasesController.updateLease);
router.delete('/:id', leasesController.deleteLease);

module.exports = router;
