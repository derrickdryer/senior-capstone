/**
 * Inquiry model representing a tenant inquiry.
 *
 * @module models/inquiry
 */
module.exports = (sequelize, DataTypes) => {
  const Inquiry = sequelize.define(
    'Inquiry',
    {
      // Unique identifier for the inquiry
      inquiry_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key referencing the tenant who submitted the inquiry
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Foreign key referencing the property associated with the inquiry
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Foreign key referencing the apartment related to the inquiry
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Content of the inquiry message
      inquiry_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Date when a response was provided, if available
      response_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  return Inquiry;
};
