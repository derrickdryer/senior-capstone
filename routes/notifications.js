const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

// Define CRUD routes for notifications
router.get('/', notificationsController.getAllNotifications);
router.get('/:id', notificationsController.getNotificationById);
router.post('/', notificationsController.createNotification);
router.put('/:id', notificationsController.updateNotification);
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
