const pool = require('../database'); // Import MySQL connection

// Get all leases
/**
 * Retrieves all lease records from the database.
 *
 * @async
 * @function getAllLeases
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} On success, ctx.body is set to an array of lease objects.
 * @throws {Error} If an error occurs during the query.
 */
exports.getAllLeases = async (ctx) => {
  try {
    /**
     * Retrieves all rows from the leases table.
     *
     * @returns {Promise<Array>} A promise that resolves to an array of lease objects.
     * @throws {Error} If there is an error executing the query.
     */
    const [rows] = await pool.query('SELECT * FROM leases');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single lease by ID
/**
 * Retrieves lease details by its ID.
 *
 * @async
 * @function getLeaseById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {string} ctx.params.id - The ID of the lease to retrieve.
 * @returns {Promise<void>} On success, ctx.body contains the lease record.
 * @throws {Error} If an error occurs during the query.
 */
exports.getLeaseById = async (ctx) => {
  try {
    /**
     * Retrieves lease information from the database based on the lease ID provided in the request parameters.
     *
     * @param {Object} ctx - The context object containing request and response information.
     * @param {Object} ctx.params - The parameters object containing route parameters.
     * @param {string} ctx.params.id - The ID of the lease to retrieve.
     * @returns {Promise<Array>} A promise that resolves to an array containing the lease information.
     * @throws {Error} If there is an error executing the database query.
     */
    const [rows] = await pool.query('SELECT * FROM leases WHERE lease_id = ?', [
      ctx.params.id,
    ]);
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Lease not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get an expanded lease with details from related tables: tenants, apartments, and properties.
exports.getLeaseByIdDetailed = async (ctx) => {
  try {
    const sql = `
      SELECT 
        l.*,
        t.first_name, t.last_name, t.email,
        a.unit_number, a.floor, a.bedrooms, a.bathrooms,
        p.address, p.city, p.state, p.postal_code
      FROM leases l
      JOIN tenants t ON l.tenant_id = t.tenant_id
      JOIN apartments a ON l.apartment_id = a.apartment_id
      JOIN assets p ON a.property_id = p.property_id
      WHERE l.lease_id = ?
    `;
    const [rows] = await pool.query(sql, [ctx.params.id]);
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Lease not found' };
      return;
    }
    const row = rows[0];
    // Restructure the row into nested details.
    const expandedLease = {
      lease_id: row.lease_id,
      tenant_id: row.tenant_id,
      apartment_id: row.apartment_id,
      lease_start_date: row.lease_start_date,
      lease_end_date: row.lease_end_date,
      monthly_rent: row.monthly_rent,
      security_deposit: row.security_deposit,
      status: row.status,
      tenant: {
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
      },
      apartment: {
        apartment_id: row.apartment_id,
        unit_number: row.unit_number,
        floor: row.floor,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
      },
      property: {
        address: row.address,
        city: row.city,
        state: row.state,
        postal_code: row.postal_code,
      },
    };
    ctx.status = 200;
    ctx.body = expandedLease;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new lease
/**
 * Creates a new lease record in the database.
 *
 * @async
 * @function createLease
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The lease details.
 * @param {number} ctx.request.body.tenant_id - The tenant's ID.
 * @param {number} ctx.request.body.apartment_id - The apartment's ID.
 * @param {string} ctx.request.body.lease_start_date - The start date of the lease.
 * @param {string} ctx.request.body.lease_end_date - The end date of the lease.
 * @param {number} ctx.request.body.monthly_rent - The monthly rent amount.
 * @param {number} ctx.request.body.security_deposit - The security deposit amount.
 * @param {string} ctx.request.body.status - The status of the lease.
 * @returns {Promise<void>} On success, ctx.body includes a success message and the new lease ID.
 * @throws {Error} If an error occurs during the query.
 */
exports.createLease = async (ctx) => {
  try {
    const {
      tenant_id,
      apartment_id,
      lease_start_date,
      lease_end_date,
      monthly_rent,
      security_deposit,
      status,
    } = ctx.request.body;
    /**
     * Inserts a new lease record into the leases table.
     *
     * @param {number} tenant_id - The ID of the tenant.
     * @param {number} apartment_id - The ID of the apartment.
     * @param {string} lease_start_date - The start date of the lease.
     * @param {string} lease_end_date - The end date of the lease.
     * @param {number} monthly_rent - The monthly rent amount.
     * @param {number} security_deposit - The security deposit amount.
     * @param {string} status - The status of the lease.
     * @returns {Promise<Object>} The result of the query.
     * @throws {Error} If the query fails.
     */
    const [result] = await pool.query(
      'INSERT INTO leases (tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        tenant_id,
        apartment_id,
        lease_start_date,
        lease_end_date,
        monthly_rent,
        security_deposit,
        status,
      ]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Lease created successfully',
      lease_id: result.insertId,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a lease by ID
/**
 * Updates an existing lease record with the provided information.
 *
 * @async
 * @function updateLease
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {number} ctx.params.id - The ID of the lease to update.
 * @param {Object} ctx.request.body - The updated lease details.
 * @param {number} ctx.request.body.tenant_id - The tenant's ID.
 * @param {number} ctx.request.body.apartment_id - The apartment's ID.
 * @param {string} ctx.request.body.lease_start_date - The start date of the lease.
 * @param {string} ctx.request.body.lease_end_date - The end date of the lease.
 * @param {number} ctx.request.body.monthly_rent - The monthly rent amount.
 * @param {number} ctx.request.body.security_deposit - The security deposit amount.
 * @param {string} ctx.request.body.status - The status of the lease.
 * @returns {Promise<void>} On success, ctx.body includes a confirmation message.
 * @throws {Error} If an error occurs during the update.
 */
exports.updateLease = async (ctx) => {
  try {
    const {
      tenant_id,
      apartment_id,
      lease_start_date,
      lease_end_date,
      monthly_rent,
      security_deposit,
      status,
    } = ctx.request.body;
    /**
     * Updates a lease record in the database with the provided details.
     *
     * @param {number} tenant_id - The ID of the tenant.
     * @param {number} apartment_id - The ID of the apartment.
     * @param {string} lease_start_date - The start date of the lease.
     * @param {string} lease_end_date - The end date of the lease.
     * @param {number} monthly_rent - The monthly rent amount.
     * @param {number} security_deposit - The security deposit amount.
     * @param {string} status - The status of the lease.
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters object.
     * @param {number} ctx.params.id - The ID of the lease to be updated.
     * @returns {Promise<Object>} The result of the update query.
     * @throws {Error} If the query fails.
     */
    const [result] = await pool.query(
      'UPDATE leases SET tenant_id = ?, apartment_id = ?, lease_start_date = ?, lease_end_date = ?, monthly_rent = ?, security_deposit = ?, status = ? WHERE lease_id = ?',
      [
        tenant_id,
        apartment_id,
        lease_start_date,
        lease_end_date,
        monthly_rent,
        security_deposit,
        status,
        ctx.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Lease not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Lease updated successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a lease by ID
/**
 * Deletes a lease record from the database.
 *
 * @async
 * @function deleteLease
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Route parameters.
 * @param {string} ctx.params.id - The ID of the lease to delete.
 * @returns {Promise<void>} On success, ctx.body includes a confirmation message.
 * @throws {Error} If an error occurs during deletion.
 */
exports.deleteLease = async (ctx) => {
  try {
    /**
     * Deletes a lease from the database based on the provided lease ID.
     *
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters object.
     * @param {string} ctx.params.id - The ID of the lease to be deleted.
     * @returns {Promise<Object>} - The result of the delete query.
     * @throws {Error} - If the query fails.
     */
    const [result] = await pool.query('DELETE FROM leases WHERE lease_id = ?', [
      ctx.params.id,
    ]);
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Lease not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Lease deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Join the tenants and leases tables to get tenant details for each lease and ensure user_id is on each row
/**
 * Retrieves all leases with tenant details.
 *
 * @async
 * @function getAllLeasesWithTenantDetails
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} On success, ctx.body contains an array of lease objects with tenant details.
 * @throws {Error} If an error occurs during the query.
 */
exports.getAllLeasesWithTenantDetails = async (ctx) => {
  try {
    const sql =
      'SELECT l.*, t.first_name, t.last_name, t.email, t.user_id FROM leases l JOIN tenants t ON l.tenant_id = t.tenant_id WHERE t.user_id = ?';
    const userId = ctx.params.id; // Ensure your route parameter is named "id"
    const [rows] = await pool.query(sql, [userId]);
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
