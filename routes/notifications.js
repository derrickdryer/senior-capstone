// File purpose: Defines CRUD routes for notification management.
// Endpoints:
//   GET /      - Returns all notifications
//   GET /:id   - Returns a specific notification by id
//   POST /     - Creates a new notification
//   PUT /:id   - Updates an existing notification by id
//   DELETE /:id - Deletes a notification

const Router = require('koa-router');
const notificationsController = require('../controllers/notificationsController');

const router = new Router();

// GET all notifications
router.get('/', notificationsController.getAllNotifications);

// GET notification by id
router.get('/:id', notificationsController.getNotificationById);

// Create a new notification
router.post('/', notificationsController.createNotification);

// Update an existing notification
router.put('/:id', notificationsController.updateNotification);

// Delete a notification
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
