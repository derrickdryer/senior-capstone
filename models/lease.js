module.exports = (sequelize, DataTypes) => {
  const Lease = sequelize.define(
    'Lease',
    {
      lease_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lease_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lease_end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      monthly_rent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      security_deposit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'terminated', 'pending'),
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Lease;
};
