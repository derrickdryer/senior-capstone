const pool = require('../database'); // Import MySQL connection

// Get all notifications
exports.getAllNotifications = async (ctx) => {
  try {
    console.log('✅ Fetching all notifications...');
    const [rows] = await pool.query('SELECT * FROM notifications');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single notification by ID
exports.getNotificationById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE notification_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Notification not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching notification:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new notification
exports.createNotification = async (ctx) => {
  try {
    const { user_id, notification_type, content, sent_date, read_status } =
      ctx.request.body;
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, notification_type, content, sent_date, read_status) VALUES (?, ?, ?, ?, ?)',
      [user_id, notification_type, content, sent_date, read_status]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Notification created successfully',
      notification_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a notification by ID
exports.updateNotification = async (ctx) => {
  try {
    const { user_id, notification_type, content, sent_date, read_status } =
      ctx.request.body;
    const [result] = await pool.query(
      'UPDATE notifications SET user_id = ?, notification_type = ?, content = ?, sent_date = ?, read_status = ? WHERE notification_id = ?',
      [
        user_id,
        notification_type,
        content,
        sent_date,
        read_status,
        ctx.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Notification not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Notification updated successfully' };
  } catch (error) {
    console.error('❌ Error updating notification:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a notification by ID
exports.deleteNotification = async (ctx) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM notifications WHERE notification_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Notification not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Notification deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
