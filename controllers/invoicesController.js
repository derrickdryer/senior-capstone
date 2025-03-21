const pool = require('../database');

/**
 * Retrieves all invoices from the database.
 *
 * @async
 * @function getAllInvoices
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} Sets ctx.body with an array of invoice objects.
 * @throws {Error} If retrieving invoices fails.
 */
exports.getAllInvoices = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM invoices');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching invoices:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves a specific invoice by its ID.
 *
 * @async
 * @function getInvoiceById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique invoice identifier.
 * @returns {Promise<void>} Sets ctx.body with the invoice data.
 * @throws {Error} If retrieval fails.
 */
exports.getInvoiceById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM invoices WHERE invoice_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Invoice not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching invoice:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves invoices by lease ID.
 *
 * @async
 * @function getInvoicesByLeaseId
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.query - The query parameters.
 * @param {number|string} ctx.query.lease_id - The lease ID to filter invoices.
 * @returns {Promise<void>} Sets ctx.body with an array of invoices for the lease.
 * @throws {Error} If retrieval fails.
 */
exports.getInvoicesByLeaseId = async (ctx) => {
  try {
    const { lease_id } = ctx.query;
    if (!lease_id) {
      ctx.status = 400;
      ctx.body = { error: 'lease_id query parameter is required' };
      return;
    }

    const [rows] = await pool.query(
      'SELECT * FROM invoices WHERE lease_id = ?',
      [lease_id]
    );
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching invoices by lease ID:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Creates a new invoice.
 *
 * @async
 * @function createInvoice
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The invoice details.
 * @param {number|string} ctx.request.body.lease_id - The lease ID associated with the invoice.
 * @param {string} ctx.request.body.invoice_date - The date of the invoice.
 * @param {number} ctx.request.body.total_amount - The total amount of the invoice.
 * @param {Array} ctx.request.body.charges - The breakdown of charges (as an array of objects).
 * @param {string} ctx.request.body.status - The status of the invoice (e.g., 'unpaid', 'paid').
 * @returns {Promise<void>} Sets ctx.body with a success message and the new invoice ID.
 * @throws {Error} If creation fails.
 */
exports.createInvoice = async (ctx) => {
  try {
    const { lease_id, invoice_date, total_amount, charges, status } =
      ctx.request.body;

    if (!lease_id || !invoice_date || !total_amount || !charges || !status) {
      ctx.status = 400;
      ctx.body = { error: 'All fields are required.' };
      return;
    }

    const result = await pool.query(
      'INSERT INTO invoices (lease_id, invoice_date, total_amount, charges, status) VALUES (?, ?, ?, ?, ?)',
      [lease_id, invoice_date, total_amount, JSON.stringify(charges), status]
    );

    ctx.status = 201;
    ctx.body = {
      message: 'Invoice created successfully!',
      invoice_id: result[0].insertId,
    };
  } catch (error) {
    console.error('❌ Error creating invoice:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Updates an existing invoice.
 *
 * @async
 * @function updateInvoice
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The invoice ID to update.
 * @param {Object} ctx.request.body - The updated invoice details.
 * @returns {Promise<void>} Sets ctx.body with an update confirmation message.
 * @throws {Error} If the update fails.
 */
exports.updateInvoice = async (ctx) => {
  try {
    const { lease_id, invoice_date, total_amount, charges, status } =
      ctx.request.body;

    const result = await pool.query(
      'UPDATE invoices SET lease_id = ?, invoice_date = ?, total_amount = ?, charges = ?, status = ? WHERE invoice_id = ?',
      [
        lease_id,
        invoice_date,
        total_amount,
        JSON.stringify(charges),
        status,
        ctx.params.id,
      ]
    );

    if (result[0].affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Invoice not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Invoice updated successfully' };
  } catch (error) {
    console.error('❌ Error updating invoice:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Deletes an invoice from the database.
 *
 * @async
 * @function deleteInvoice
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique identifier of the invoice to delete.
 * @returns {Promise<void>} Sets ctx.body with a deletion confirmation message.
 * @throws {Error} If deletion fails.
 */
exports.deleteInvoice = async (ctx) => {
  try {
    const result = await pool.query(
      'DELETE FROM invoices WHERE invoice_id = ?',
      [ctx.params.id]
    );

    if (result[0].affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Invoice not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Invoice deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting invoice:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
