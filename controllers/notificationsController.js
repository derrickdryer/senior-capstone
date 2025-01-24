const pool = require('../database'); // Import MySQL connection

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    console.log("✅ Fetching all notifications...");
    const [rows] = await pool.query("SELECT * FROM notifications");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Get a single notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notifications WHERE notification_id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Notification not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching notification:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { user_id, notification_type, content, sent_date, read_status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO notifications (user_id, notification_type, content, sent_date, read_status) VALUES (?, ?, ?, ?, ?)",
      [user_id, notification_type, content, sent_date, read_status]
    );
    res.status(201).json({ message: "Notification created successfully", notification_id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const { user_id, notification_type, content, sent_date, read_status } = req.body;
    const [result] = await pool.query(
      "UPDATE notifications SET user_id = ?, notification_type = ?, content = ?, sent_date = ?, read_status = ? WHERE notification_id = ?",
      [user_id, notification_type, content, sent_date, read_status, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM notifications WHERE notification_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
