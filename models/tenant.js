/**
 * Tenant model representing a tenant in the rental system.
 *
 * @module models/tenant
 */
module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define(
    'Tenant',
    {
      // Unique identifier for the tenant
      tenant_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Tenant's first name
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // Tenant's last name
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // Tenant's unique email address
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      // Tenant's phone number
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      // Foreign key to the User model (if applicable)
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'tenants',
      timestamps: false,
    }
  );

  // Define associations for the Tenant model
  Tenant.associate = (models) => {
    Tenant.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL',
    });
    Tenant.hasMany(models.Lease, {
      foreignKey: 'tenant_id',
      as: 'leases',
    });
    Tenant.hasMany(models.MaintenanceRequest, {
      foreignKey: 'tenant_id',
      as: 'maintenanceRequests',
    });
  };

  return Tenant;
};
