const pool = require('../database'); // Import MySQL connection

// Get all maintenance requests
/**
 * Retrieves all maintenance requests.
 *
 * @async
 * @function getAllMaintenanceRequests
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} Sets ctx.body with an array of maintenance request objects.
 * @throws {Error} If the database query fails.
 */
exports.getAllMaintenanceRequests = async (ctx) => {
  try {
    console.log('✅ Fetching all maintenance requests...');
    /**
     * Retrieves all maintenance requests from the database.
     *
     * @returns {Promise<Array>} A promise that resolves to an array of maintenance request objects.
     * @throws {Error} If there is an issue with the database query.
     */
    const [rows] = await pool.query('SELECT * FROM maintenance_requests');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching maintenance requests:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single maintenance request by ID
/**
 * Retrieves a maintenance request by ID.
 *
 * @async
 * @function getMaintenanceRequestById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number} ctx.params.id - The maintenance request ID.
 * @returns {Promise<void>} Sets ctx.body with the maintenance request object.
 * @throws {Error} If the database query fails.
 */
exports.getMaintenanceRequestById = async (ctx) => {
  try {
    /**
     * Retrieves a maintenance request from the database based on the provided request ID.
     *
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters object.
     * @param {number} ctx.params.id - The ID of the maintenance request to retrieve.
     * @returns {Promise<Array>} A promise that resolves to an array containing the rows of the result set.
     */
    const [rows] = await pool.query(
      'SELECT * FROM maintenance_requests WHERE request_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Maintenance request not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching maintenance request:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new maintenance request
/**
 * Creates a new maintenance request.
 *
 * @async
 * @function createMaintenanceRequest
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - Details of the maintenance request.
 * @param {number} ctx.request.body.tenant_id - The tenant's ID.
 * @param {number} ctx.request.body.apartment_id - The apartment's ID.
 * @param {string} ctx.request.body.request_date - The date the request was made.
 * @param {string} ctx.request.body.issue_description - Description of the maintenance issue.
 * @param {string} ctx.request.body.status - The current status of the request.
 * @param {string} [ctx.request.body.completion_date] - (Optional) Date of completion.
 * @param {number} [ctx.request.body.assigned_to] - (Optional) ID of the maintenance worker assigned.
 * @returns {Promise<void>} Sets ctx.body with a success message and the new request ID.
 * @throws {Error} If the creation fails.
 */
exports.createMaintenanceRequest = async (ctx) => {
  try {
    const {
      tenant_id,
      apartment_id,
      request_date,
      issue_description,
      status,
      completion_date,
      assigned_to,
    } = ctx.request.body;
    /**
     * Inserts a new maintenance request into the database.
     *
     * @param {number} tenant_id - The ID of the tenant making the request.
     * @param {number} apartment_id - The ID of the apartment where the issue is located.
     * @param {string} request_date - The date the request was made.
     * @param {string} issue_description - A description of the maintenance issue.
     * @param {string} status - The current status of the maintenance request.
     * @param {string} [completion_date] - The date the maintenance was completed (optional).
     * @param {number} [assigned_to] - The ID of the maintenance worker assigned to the request (optional).
     * @returns {Promise<Object>} The result of the query.
     * @throws {Error} If the query fails.
     */
    const [result] = await pool.query(
      'INSERT INTO maintenance_requests (tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        tenant_id,
        apartment_id,
        request_date,
        issue_description,
        status,
        completion_date,
        assigned_to,
      ]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Maintenance request created successfully',
      request_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating maintenance request:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a maintenance request by ID
/**
 * Updates an existing maintenance request.
 *
 * @async
 * @function updateMaintenanceRequest
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number} ctx.params.id - The maintenance request ID.
 * @param {Object} ctx.request.body - Updated details for the request.
 * @param {number} ctx.request.body.tenant_id - The tenant's ID.
 * @param {number} ctx.request.body.apartment_id - The apartment's ID.
 * @param {string} ctx.request.body.request_date - The date the request was made.
 * @param {string} ctx.request.body.issue_description - Updated issue description.
 * @param {string} ctx.request.body.status - Updated status of the request.
 * @param {string} ctx.request.body.completion_date - The completion date.
 * @param {number} ctx.request.body.assigned_to - The maintenance worker's ID.
 * @returns {Promise<void>} Sets ctx.body with a success confirmation.
 * @throws {Error} If the update operation fails.
 */
exports.updateMaintenanceRequest = async (ctx) => {
  try {
    const {
      tenant_id,
      apartment_id,
      request_date,
      issue_description,
      status,
      completion_date,
      assigned_to,
    } = ctx.request.body;
    /**
     * Updates a maintenance request in the database with the provided details.
     *
     * @param {number} tenant_id - The ID of the tenant.
     * @param {number} apartment_id - The ID of the apartment.
     * @param {string} request_date - The date of the maintenance request.
     * @param {string} issue_description - The description of the issue.
     * @param {string} status - The status of the maintenance request.
     * @param {string} completion_date - The date the maintenance request was completed.
     * @param {number} assigned_to - The ID of the person assigned to the maintenance request.
     * @param {Object} ctx - The context object containing request parameters.
     * @param {number} ctx.params.id - The ID of the maintenance request to update.
     * @returns {Promise<Object>} The result of the update query.
     */
    const [result] = await pool.query(
      'UPDATE maintenance_requests SET tenant_id = ?, apartment_id = ?, request_date = ?, issue_description = ?, status = ?, completion_date = ?, assigned_to = ? WHERE request_id = ?',
      [
        tenant_id,
        apartment_id,
        request_date,
        issue_description,
        status,
        completion_date,
        assigned_to,
        ctx.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Maintenance request not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Maintenance request updated successfully' };
  } catch (error) {
    console.error('❌ Error updating maintenance request:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a maintenance request by ID
/**
 * Deletes a maintenance request.
 *
 * @async
 * @function deleteMaintenanceRequest
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number} ctx.params.id - The maintenance request ID.
 * @returns {Promise<void>} Sets ctx.body with a deletion confirmation.
 * @throws {Error} If the deletion fails.
 */
exports.deleteMaintenanceRequest = async (ctx) => {
  try {
    /**
     * Deletes a maintenance request from the database based on the provided request ID.
     *
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters object.
     * @param {string} ctx.params.id - The ID of the maintenance request to be deleted.
     * @returns {Promise<Object>} The result of the delete query.
     * @throws {Error} If the query fails.
     */
    const [result] = await pool.query(
      'DELETE FROM maintenance_requests WHERE request_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Maintenance request not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Maintenance request deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting maintenance request:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
