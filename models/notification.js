module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notification_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sent_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      read_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Notification;
};
