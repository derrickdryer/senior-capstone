const Router = require('koa-router');
const maintenanceRequestsController = require('../controllers/maintenanceRequestsController');

const router = new Router();

// Define CRUD routes for maintenance requests
router.get('/', maintenanceRequestsController.getAllMaintenanceRequests);
router.get('/:id', maintenanceRequestsController.getMaintenanceRequestById);
router.post('/', maintenanceRequestsController.createMaintenanceRequest);
router.put('/:id', maintenanceRequestsController.updateMaintenanceRequest);
router.delete('/:id', maintenanceRequestsController.deleteMaintenanceRequest);

module.exports = router;