module.exports = (sequelize, DataTypes) => {
    const Inquiry = sequelize.define('Inquiry', {
      inquiry_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      inquiry_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      response_date: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    }, { timestamps: true });
  
    return Inquiry;
  };
  