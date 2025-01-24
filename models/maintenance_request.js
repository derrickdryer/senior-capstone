module.exports = (sequelize, DataTypes) => {
    const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
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
        type: DataTypes.DATE,
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
        type: DataTypes.DATE,
        allowNull: true,
      },
      assigned_to: {
        type: DataTypes.STRING(50),
        allowNull: true,
      }
    }, { timestamps: true });
  
    return MaintenanceRequest;
  };
  