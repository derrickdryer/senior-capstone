/**
 * Notification model for user notifications.
 *
 * @module models/notification
 */
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      // Unique identifier for the notification
      notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key referencing the associated user
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Type of notification (e.g., email, SMS)
      notification_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // Content of the notification message
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Date when the notification was sent
      sent_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // Read status of the notification (e.g., "read", "unread")
      read_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  return Notification;
};
