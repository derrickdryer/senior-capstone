const pool = require('../database'); // Import MySQL connection

/**
 * Retrieves all tenants from the database.
 *
 * @async
 * @function getAllTenants
 * @param {Object} ctx - Koa context including request and response objects.
 * @returns {Promise<void>} Sets ctx.body to an array of tenant objects.
 * @throws {Error} If the database query fails.
 */
exports.getAllTenants = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tenants');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves a tenant by ID.
 *
 * @async
 * @function getTenantById
 * @param {Object} ctx - Koa context.
 * @param {Object} ctx.params - Route parameters.
 * @param {number} ctx.params.id - ID of the tenant to retrieve.
 * @returns {Promise<void>} Sets ctx.body to the tenant object if found.
 * @throws {Error} If the query fails.
 */
exports.getTenantById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tenants WHERE tenant_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Tenant not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Creates a new tenant record.
 *
 * @async
 * @function createTenant
 * @param {Object} ctx - Koa context containing the request body.
 * @param {string} ctx.request.body.first_name - Tenant's first name.
 * @param {string} ctx.request.body.last_name - Tenant's last name.
 * @param {string} ctx.request.body.email - Tenant's email address.
 * @param {string} ctx.request.body.phone_number - Tenant's phone number.
 * @param {number} ctx.request.body.user_id - Associated user ID.
 * @returns {Promise<void>} Sets ctx.body with a success message and the new tenant ID.
 * @throws {Error} If the insertion fails.
 */
exports.createTenant = async (ctx) => {
  try {
    const { first_name, last_name, email, phone_number, user_id } =
      ctx.request.body;
    const [result] = await pool.query(
      'INSERT INTO tenants (first_name, last_name, email, phone_number, user_id) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone_number, user_id]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Tenant created successfully',
      tenant_id: result.insertId,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Updates an existing tenant record.
 *
 * @async
 * @function updateTenant
 * @param {Object} ctx - Koa context containing parameters and the request body.
 * @param {Object} ctx.params - Route parameters.
 * @param {number} ctx.params.id - ID of the tenant to update.
 * @param {string} ctx.request.body.first_name - Updated first name.
 * @param {string} ctx.request.body.last_name - Updated last name.
 * @param {string} ctx.request.body.email - Updated email address.
 * @param {string} ctx.request.body.phone_number - Updated phone number.
 * @param {number} ctx.request.body.user_id - Updated associated user ID.
 * @returns {Promise<void>} Sets ctx.body with a confirmation message.
 * @throws {Error} If the update fails.
 */
exports.updateTenant = async (ctx) => {
  try {
    const { first_name, last_name, email, phone_number, user_id } =
      ctx.request.body;
    const [result] = await pool.query(
      'UPDATE tenants SET first_name = ?, last_name = ?, email = ?, phone_number = ?, user_id = ? WHERE tenant_id = ?',
      [first_name, last_name, email, phone_number, user_id, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Tenant not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Tenant updated successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Deletes a tenant record by ID.
 *
 * @async
 * @function deleteTenant
 * @param {Object} ctx - Koa context containing route parameters.
 * @param {Object} ctx.params - Request parameters.
 * @param {number} ctx.params.id - ID of the tenant to delete.
 * @returns {Promise<void>} Sets ctx.body with a deletion confirmation message.
 * @throws {Error} If the deletion fails.
 */
exports.deleteTenant = async (ctx) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM tenants WHERE tenant_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Tenant not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Tenant deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
