module.exports = (sequelize, DataTypes) => {
  const image = sequelize.define(
    'image',
    {
      image_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      image_data: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.ENUM('image/jpeg', 'image/png'),
        allowNull: false,
      },
      caption: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'images',
      timestamps: false,
    }
  );

  Image.associate = (models) => {
    Image.belongsTo(models.Asset, { foreignKey: 'property_id', as: 'asset' });
    Image.belongsTo(models.Apartment, {
      foreignKey: 'apartment_id',
      as: 'apartment',
    });
  };

  return image;
};
