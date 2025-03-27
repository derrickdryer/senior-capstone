module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      invoice_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      charges: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'overdue'),
        allowNull: false,
      },
    },
    {
      tableName: 'invoices',
      timestamps: false,
    }
  );

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Lease, { foreignKey: 'lease_id', as: 'lease' });
  };

  return Invoice;
};
