const pool = require('../database'); // Import MySQL connection

// Get all payments
/**
 * Retrieves all payment records from the database.
 *
 * @async
 * @function getAllPayments
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} Sets ctx.body with an array of payment objects.
 * @throws {Error} If the database query fails.
 */
exports.getAllPayments = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single payment by ID
/**
 * Retrieves a payment record by its ID.
 *
 * @async
 * @function getPaymentById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number|string} ctx.params.id - The payment ID.
 * @returns {Promise<void>} Sets ctx.body with the payment record if found.
 * @throws {Error} If the database query fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new payment
/**
 * Creates a new payment record in the database.
 *
 * @async
 * @function createPayment
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The payment details.
 * @param {number} ctx.request.body.lease_id - The lease identifier associated with the payment.
 * @param {string} ctx.request.body.payment_date - The date the payment was made.
 * @param {number} ctx.request.body.amount - The payment amount.
 * @param {string} ctx.request.body.payment_method - The payment method (e.g., credit card, cash).
 * @param {string} ctx.request.body.status - The payment status (e.g., completed, pending).
 * @returns {Promise<void>} Sets ctx.body with a success message and the new payment ID.
 * @throws {Error} If the insertion fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a payment by ID
/**
 * Updates an existing payment record with new details.
 *
 * @async
 * @function updatePayment
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number|string} ctx.params.id - The payment ID to update.
 * @param {Object} ctx.request.body - The updated payment details.
 * @param {number} ctx.request.body.lease_id - The updated lease ID.
 * @param {string} ctx.request.body.payment_date - The updated payment date.
 * @param {number} ctx.request.body.amount - The updated payment amount.
 * @param {string} ctx.request.body.payment_method - The updated payment method.
 * @param {string} ctx.request.body.status - The updated payment status.
 * @returns {Promise<void>} Sets ctx.body with a confirmation message.
 * @throws {Error} If the update fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a payment by ID
/**
 * Deletes a payment record from the database.
 *
 * @async
 * @function deletePayment
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number|string} ctx.params.id - The payment ID.
 * @returns {Promise<void>} Sets ctx.body with a deletion confirmation message.
 * @throws {Error} If the deletion fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
