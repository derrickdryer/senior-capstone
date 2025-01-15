// routes/notifications.js

const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} = require('../controllers/notificationsController');

// GET all notifications
router.get('/', getAllNotifications);

// GET a single notification by ID
router.get('/:id', getNotificationById);

// POST create a new notification
router.post('/', createNotification);

// PUT update a notification by ID
router.put('/:id', updateNotification);

// DELETE a notification by ID
router.delete('/:id', deleteNotification);

module.exports = router;