/**
 * MaintenanceRequest model representing maintenance requests submitted by tenants.
 *
 * @module models/maintenance_request
 */
module.exports = (sequelize, DataTypes) => {
  const MaintenanceRequest = sequelize.define(
    'MaintenanceRequest',
    {
      // Unique identifier for the maintenance request
      request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key referencing the tenant who submitted the request
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Foreign key referencing the apartment where the issue is located
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Date when the maintenance request was submitted
      request_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // Description of the maintenance issue
      issue_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Current status: pending, in_progress, or completed
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        allowNull: false,
      },
      // Date when the maintenance request was completed, if applicable
      completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Name of the person assigned to handle the maintenance request
      assigned_to: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  return MaintenanceRequest;
};
