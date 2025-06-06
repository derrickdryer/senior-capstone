/**
 * Asset model representing a property asset.
 *
 * @module models/asset
 */
module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define(
    'Asset',
    {
      // Unique identifier for the asset
      property_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Street address of the asset
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // City where the asset is located
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // State of the asset
      state: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      // Postal code for the asset
      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      // Total number of apartments within the asset
      num_apartments: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Availability status of the asset
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'assets',
      timestamps: false, // Disables createdAt and updatedAt fields
    }
  );

  // Define associations for the Asset model
  Asset.associate = (models) => {
    Asset.hasMany(models.Apartment, {
      foreignKey: 'property_id',
      as: 'apartments',
    });
    Asset.hasMany(models.Image, { foreignKey: 'property_id', as: 'images' });
  };

  return Asset;
};
