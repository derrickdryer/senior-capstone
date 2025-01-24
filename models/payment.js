module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM('credit_card', 'bank_transfer', 'check'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('completed', 'pending', 'failed'),
        allowNull: false,
      }
    }, { timestamps: true });
  
    return Payment;
  };
  