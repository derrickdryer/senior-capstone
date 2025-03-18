const pool = require('../database'); // Import MySQL connection

// Get all notifications
/**
 * Retrieves all notification records from the database.
 *
 * @async
 * @function getAllNotifications
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} On success, sets ctx.body to an array of notification objects.
 * @throws {Error} If the database query fails.
 */
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
/**
 * Retrieves a single notification based on its ID.
 *
 * @async
 * @function getNotificationById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique ID of the notification.
 * @returns {Promise<void>} On success, sets ctx.body to the notification object.
 * @throws {Error} If the database query fails.
 */
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
/**
 * Creates a new notification record in the database.
 *
 * @async
 * @function createNotification
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The notification details.
 * @param {number} ctx.request.body.user_id - The ID of the user who will receive the notification.
 * @param {string} ctx.request.body.notification_type - The type/category of the notification.
 * @param {string} ctx.request.body.content - The notification content.
 * @param {Date|string} ctx.request.body.sent_date - The date the notification was sent.
 * @param {boolean} ctx.request.body.read_status - The read status of the notification.
 * @returns {Promise<void>} On success, sets ctx.body with a success message and the new notification ID.
 * @throws {Error} If the insertion fails.
 */
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
/**
 * Updates an existing notification record with new details.
 *
 * @async
 * @function updateNotification
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique ID of the notification to update.
 * @param {Object} ctx.request.body - The updated notification details.
 * @param {number} ctx.request.body.user_id - The ID of the associated user.
 * @param {string} ctx.request.body.notification_type - The updated notification type.
 * @param {string} ctx.request.body.content - The updated notification content.
 * @param {Date|string} ctx.request.body.sent_date - The updated sent date.
 * @param {boolean} ctx.request.body.read_status - The updated read status.
 * @returns {Promise<void>} On success, sets ctx.body with a confirmation message.
 * @throws {Error} If the update query fails.
 */
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
/**
 * Deletes a notification record from the database.
 *
 * @async
 * @function deleteNotification
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique ID of the notification to delete.
 * @returns {Promise<void>} On success, sets ctx.body with a deletion confirmation.
 * @throws {Error} If the deletion operation fails.
 */
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
