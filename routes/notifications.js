const Router = require('koa-router');
const notificationsController = require('../controllers/notificationsController');

const router = new Router();

// Define CRUD routes for notifications
router.get('/', notificationsController.getAllNotifications);
router.get('/:id', notificationsController.getNotificationById);
router.post('/', notificationsController.createNotification);
router.put('/:id', notificationsController.updateNotification);
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
