module.exports = (sequelize, DataTypes) => {
  const MaintenanceRequest = sequelize.define(
    'MaintenanceRequest',
    {
      request_id: {
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
      request_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      issue_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        allowNull: false,
      },
      completion_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      assigned_to: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: 'maintenance_requests',
      timestamps: false,
    }
  );

  MaintenanceRequest.associate = (models) => {
    MaintenanceRequest.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
    });
    MaintenanceRequest.belongsTo(models.Apartment, {
      foreignKey: 'apartment_id',
      as: 'apartment',
    });
  };

  return MaintenanceRequest;
};
