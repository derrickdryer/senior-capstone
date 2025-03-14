/**
 * Apartment model representing an apartment unit.
 *
 * @module models/apartment
 */
module.exports = (sequelize, DataTypes) => {
  const Apartment = sequelize.define(
    'Apartment',
    {
      // Unique identifier for the apartment
      apartment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key referencing the associated property
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Unit number identifying the apartment unit
      unit_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      // Floor number where the apartment is located
      floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Number of bedrooms, supporting fractional values (e.g., 1.5)
      bedrooms: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
      },
      // Number of bathrooms, supporting fractional values
      bathrooms: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
      },
      // Total square footage of the apartment
      square_footage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // Monthly rent amount for the apartment
      rent_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  return Apartment;
};
