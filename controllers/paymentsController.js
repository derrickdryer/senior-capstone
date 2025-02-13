const pool = require('../database'); // Import MySQL connection

// Get all payments
exports.getAllPayments = async (ctx) => {
  try {
    console.log('✅ Fetching all payments...');
    const [rows] = await pool.query('SELECT * FROM payments');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching payments:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single payment by ID
exports.getPaymentById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE payment_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Payment not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new payment
exports.createPayment = async (ctx) => {
  try {
    const { lease_id, payment_date, amount, payment_method, status } =
      ctx.request.body;
    const [result] = await pool.query(
      'INSERT INTO payments (lease_id, payment_date, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)',
      [lease_id, payment_date, amount, payment_method, status]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Payment created successfully',
      payment_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating payment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a payment by ID
exports.updatePayment = async (ctx) => {
  try {
    const { lease_id, payment_date, amount, payment_method, status } =
      ctx.request.body;
    const [result] = await pool.query(
      'UPDATE payments SET lease_id = ?, payment_date = ?, amount = ?, payment_method = ?, status = ? WHERE payment_id = ?',
      [lease_id, payment_date, amount, payment_method, status, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Payment not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Payment updated successfully' };
  } catch (error) {
    console.error('❌ Error updating payment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a payment by ID
exports.deletePayment = async (ctx) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM payments WHERE payment_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Payment not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Payment deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
