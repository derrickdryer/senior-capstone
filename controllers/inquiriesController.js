const pool = require('../database'); // Import MySQL connection

// Get all inquiries
/**
 * Retrieves all inquiries from the database.
 *
 * @async
 * @function getAllInquiries
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} On success, ctx.body contains an array of inquiry records.
 * @throws {Error} If the query fails.
 */
exports.getAllInquiries = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inquiries');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching inquiries:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single inquiry by ID
/**
 * Retrieves a specific inquiry by its ID.
 *
 * @async
 * @function getInquiryById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The request parameters.
 * @param {number} ctx.params.id - The inquiry ID.
 * @returns {Promise<void>} On success, ctx.body contains the inquiry record.
 * @throws {Error} If the query fails.
 */
exports.getInquiryById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM inquiries WHERE inquiry_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Inquiry not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching inquiry:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new inquiry
/**
 * Inserts a new inquiry record into the database.
 *
 * @async
 * @function createInquiry
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The inquiry details.
 * @param {number} ctx.request.body.tenant_id - The ID of the tenant.
 * @param {number} ctx.request.body.apartment_id - The ID of the apartment.
 * @param {string} ctx.request.body.inquiry_date - The date of the inquiry.
 * @param {string} ctx.request.body.message - The inquiry message.
 * @returns {Promise<void>} On success, ctx.body includes a success message and new inquiry ID.
 * @throws {Error} If the query fails.
 */
exports.createInquiry = async (ctx) => {
  try {
    const { tenant_id, apartment_id, inquiry_date, message } = ctx.request.body;
    const [result] = await pool.query(
      'INSERT INTO inquiries (tenant_id, apartment_id, inquiry_date, message) VALUES (?, ?, ?, ?)',
      [tenant_id, apartment_id, inquiry_date, message]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Inquiry created successfully',
      inquiry_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating inquiry:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update an inquiry by ID
/**
 * Updates an existing inquiry record with new details.
 *
 * @async
 * @function updateInquiry
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The request parameters.
 * @param {number} ctx.params.id - The ID of the inquiry to update.
 * @param {Object} ctx.request.body - The updated inquiry details.
 * @param {number} ctx.request.body.tenant_id - The tenant ID.
 * @param {number} ctx.request.body.apartment_id - The apartment ID.
 * @param {string} ctx.request.body.inquiry_date - The updated inquiry date.
 * @param {string} ctx.request.body.message - The updated inquiry message.
 * @returns {Promise<void>} On success, ctx.body includes a confirmation message.
 * @throws {Error} If the query fails.
 */
exports.updateInquiry = async (ctx) => {
  try {
    const { tenant_id, apartment_id, inquiry_date, message } = ctx.request.body;
    const [result] = await pool.query(
      'UPDATE inquiries SET tenant_id = ?, apartment_id = ?, inquiry_date = ?, message = ? WHERE inquiry_id = ?',
      [tenant_id, apartment_id, inquiry_date, message, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Inquiry not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Inquiry updated successfully' };
  } catch (error) {
    console.error('❌ Error updating inquiry:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete an inquiry by ID
/**
 * Deletes an inquiry record from the database.
 *
 * @async
 * @function deleteInquiry
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The request parameters.
 * @param {number} ctx.params.id - The ID of the inquiry to delete.
 * @returns {Promise<void>} On success, ctx.body includes a confirmation message.
 * @throws {Error} If the query fails.
 */
exports.deleteInquiry = async (ctx) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM inquiries WHERE inquiry_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Inquiry not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Inquiry deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting inquiry:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
