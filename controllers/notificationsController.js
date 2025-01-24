// controllers/notificationsController.js

const { notifications } = require('../models/schemas');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const results = await notifications.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await notifications.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const newNotification = await notifications.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const notification = await notifications.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.update(req.body);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await notifications.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};