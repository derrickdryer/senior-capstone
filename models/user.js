/**
 * User model representing users of the application.
 *
 * @module models/user
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      // Unique identifier for the user
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Role of the user (manager, maintenance, tenant)
      role: {
        type: DataTypes.ENUM('manager', 'maintenance', 'tenant'),
        allowNull: false,
      },
      // Unique username for logging in
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      // User's password (should be stored hashed)
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // User's email address
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: false, // Disables automatic timestamp fields
    }
  );

  return User;
};
