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
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      // User's password (should be stored hashed)
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // User's email address
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: false, // Disables automatic timestamp fields
    }
  );

  // Define associations for the User model
  User.associate = (models) => {
    User.hasOne(models.Tenant, { foreignKey: 'user_id', as: 'tenant' });
  };

  return User;
};
