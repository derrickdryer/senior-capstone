module.exports = (sequelize, DataTypes) => {
    const Apartment = sequelize.define('Apartment', {
      apartment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bedrooms: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
      },
      bathrooms: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
      },
      square_footage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      rent_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      }
    }, { timestamps: true });
  
    return Apartment;
  };
  