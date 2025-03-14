/**
 * Payment model representing lease payment details.
 *
 * @module models/payment
 */
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'Payment',
    {
      // Unique identifier for the payment
      payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key linking to the associated lease
      lease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Date when the payment occurred
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // The payment amount
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // Payment method used (credit card, bank transfer, check)
      payment_method: {
        type: DataTypes.ENUM('credit_card', 'bank_transfer', 'check'),
        allowNull: false,
      },
      // Current status of the payment (completed, pending, or failed)
      status: {
        type: DataTypes.ENUM('completed', 'pending', 'failed'),
        allowNull: false,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  return Payment;
};
