/**
 * Invoice model representing invoices for lease payments.
 *
 * @module models/invoices
 */
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      // Unique identifier for the invoice
      invoice_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Foreign key referencing the lease associated with the invoice
      lease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Date the invoice was issued
      invoice_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      // Total amount due for the invoice
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // JSON field to store charge breakdown
      charges: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      // Status of the invoice: unpaid, paid, or overdue
      status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'overdue'),
        allowNull: false,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  // Define associations
  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Lease, {
      foreignKey: 'lease_id',
      onDelete: 'CASCADE',
    });
  };

  return Invoice;
};
