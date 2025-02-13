const pool = require('../database'); // Import MySQL connection

// Get all tenants
exports.getAllTenants = async (ctx) => {
  try {
    console.log('✅ Fetching all tenants...');
    const [rows] = await pool.query('SELECT * FROM tenants');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching tenants:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single tenant by ID
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
    console.error('❌ Error fetching tenant:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new tenant
exports.createTenant = async (ctx) => {
  try {
    const { first_name, last_name, email, phone_number } = ctx.request.body;
    const [result] = await pool.query(
      'INSERT INTO tenants (first_name, last_name, email, phone_number) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, phone_number]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Tenant created successfully',
      tenant_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating tenant:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a tenant by ID
exports.updateTenant = async (ctx) => {
  try {
    const { first_name, last_name, email, phone_number } = ctx.request.body;
    const [result] = await pool.query(
      'UPDATE tenants SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE tenant_id = ?',
      [first_name, last_name, email, phone_number, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Tenant not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Tenant updated successfully' };
  } catch (error) {
    console.error('❌ Error updating tenant:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a tenant by ID
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
    console.error('❌ Error deleting tenant:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
