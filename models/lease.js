/**
 * Lease model representing lease agreements between tenants and properties.
 *
 * @module models/lease
 */
module.exports = (sequelize, DataTypes) => {
  const Lease = sequelize.define(
    'Lease',
    {
      // Unique identifier for the lease
      lease_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key referencing the tenant in the lease agreement
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Foreign key referencing the leased apartment
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Start date of the lease
      lease_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      // End date of the lease
      lease_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      // Monthly rent amount for the lease
      monthly_rent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // Security deposit required for the lease
      security_deposit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // Status of the lease: active, terminated, or pending
      status: {
        type: DataTypes.ENUM('active', 'terminated', 'pending'),
        allowNull: false,
      },
    },
    {
      tableName: 'leases',
      timestamps: false, // Disables automatic createdAt and updatedAt fields
    }
  );

  // Define associations for the Lease model
  Lease.associate = (models) => {
    Lease.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
    Lease.belongsTo(models.Apartment, {
      foreignKey: 'apartment_id',
      as: 'apartment',
    });
    Lease.hasMany(models.Payment, { foreignKey: 'lease_id', as: 'payments' });
    Lease.hasMany(models.Invoice, { foreignKey: 'lease_id', as: 'invoices' });
  };

  return Lease;
};
