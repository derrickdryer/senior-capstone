const pool = require('../database'); // Import MySQL connection

// Get all assets
exports.getAllAssets = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assets');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single asset by ID
exports.getAssetById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM assets WHERE property_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Asset not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new asset
exports.createAsset = async (ctx) => {
  try {
    const { address, city, state, postal_code, num_apartments, is_available = true } = ctx.request.body;
    
    const [result] = await pool.query(
      'INSERT INTO assets (address, city, state, postal_code, num_apartments, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [address, city, state, postal_code, num_apartments, is_available]
    );

    ctx.status = 201;
    ctx.body = {
      message: 'Asset created successfully',
      property_id: result.insertId,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update an asset by ID
exports.updateAsset = async (ctx) => {
  try {
    const { address, city, state, postal_code, num_apartments, is_available } = ctx.request.body;
    
    const [result] = await pool.query(
      'UPDATE assets SET address = ?, city = ?, state = ?, postal_code = ?, num_apartments = ?, is_available = ? WHERE property_id = ?',
      [address, city, state, postal_code, num_apartments, is_available, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Asset not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Asset updated successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Toggle availability of an asset
exports.toggleAvailability = async (ctx) => {
  try {
    const { is_available } = ctx.request.body;
    
    const [result] = await pool.query(
      'UPDATE assets SET is_available = ? WHERE property_id = ?',
      [is_available, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Asset not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Asset availability updated successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete an asset by ID
exports.deleteAsset = async (ctx) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM assets WHERE property_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Asset not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Asset deleted successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
