const pool = require('../database'); // Import MySQL connection

// Get all assets
/**
 * Retrieves all assets from the database.
 *
 * @async
 * @function getAllAssets
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} On success, ctx.body is set to an array of asset objects.
 * @throws {Error} If the query execution fails.
 */
exports.getAllAssets = async (ctx) => {
  try {
    console.log('✅ Fetching all assets...');
    /**
     * Retrieves all rows from the 'assets' table.
     *
     * @returns {Promise<Array>} A promise that resolves to an array of rows from the 'assets' table.
     * @throws {Error} If there is an error executing the query.
     */
    const [rows] = await pool.query('SELECT * FROM assets');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching assets:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single asset by ID
/**
 * Retrieves a single asset by its property ID.
 *
 * @async
 * @function getAssetById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Request parameters.
 * @param {number} ctx.params.id - The property ID for the asset.
 * @returns {Promise<void>} On success, ctx.body is set to the asset object.
 * @throws {Error} If the query execution fails.
 */
exports.getAssetById = async (ctx) => {
  try {
    /**
     * Retrieves all assets associated with a specific property ID from the database.
     *
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters object.
     * @param {number} ctx.params.id - The ID of the property to retrieve assets for.
     * @returns {Promise<Array>} A promise that resolves to an array of rows containing the assets.
     * @throws {Error} If the database query fails.
     */
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
    console.error('❌ Error fetching asset:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new asset
/**
 * Creates a new asset record in the database.
 *
 * @async
 * @function createAsset
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The asset details.
 * @param {string} ctx.request.body.address - The asset's address.
 * @param {string} ctx.request.body.city - The city where the asset is located.
 * @param {string} ctx.request.body.state - The state where the asset is located.
 * @param {string} ctx.request.body.postal_code - The postal code for the asset.
 * @param {number} ctx.request.body.num_apartments - The number of apartments in the asset.
 * @returns {Promise<void>} On success, ctx.body is set with a success message and the new property ID.
 * @throws {Error} If the asset creation fails.
 */
exports.createAsset = async (ctx) => {
  try {
    const { address, city, state, postal_code, num_apartments } =
      ctx.request.body;
    /**
     * Inserts a new asset into the assets table.
     *
     * @param {string} address - The address of the asset.
     * @param {string} city - The city where the asset is located.
     * @param {string} state - The state where the asset is located.
     * @param {string} postal_code - The postal code of the asset's location.
     * @param {number} num_apartments - The number of apartments in the asset.
     * @returns {Promise<Object>} The result of the query.
     * @throws {Error} If the query fails.
     */
    const [result] = await pool.query(
      'INSERT INTO assets (address, city, state, postal_code, num_apartments) VALUES (?, ?, ?, ?, ?)',
      [address, city, state, postal_code, num_apartments]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Asset created successfully',
      property_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating asset:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update an asset by ID
/**
 * Updates an existing asset record with new details.
 *
 * @async
 * @function updateAsset
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Request parameters.
 * @param {number} ctx.params.id - The property ID of the asset.
 * @param {Object} ctx.request.body - The updated asset details.
 * @param {string} ctx.request.body.address - The updated address.
 * @param {string} ctx.request.body.city - The updated city.
 * @param {string} ctx.request.body.state - The updated state.
 * @param {string} ctx.request.body.postal_code - The updated postal code.
 * @param {number} ctx.request.body.num_apartments - The updated number of apartments.
 * @returns {Promise<void>} On success, ctx.body is set to a success message.
 * @throws {Error} If the update operation fails.
 */
exports.updateAsset = async (ctx) => {
  try {
    const { address, city, state, postal_code, num_apartments } =
      ctx.request.body;
    /**
     * Updates an asset in the database with the provided details.
     *
     * @param {string} address - The new address of the asset.
     * @param {string} city - The new city of the asset.
     * @param {string} state - The new state of the asset.
     * @param {string} postal_code - The new postal code of the asset.
     * @param {number} num_apartments - The new number of apartments in the asset.
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters of the request.
     * @param {number} ctx.params.id - The ID of the property to update.
     * @returns {Promise<Object>} The result of the update query.
     * @throws {Error} If the query fails.
     */
    const [result] = await pool.query(
      'UPDATE assets SET address = ?, city = ?, state = ?, postal_code = ?, num_apartments = ? WHERE property_id = ?',
      [address, city, state, postal_code, num_apartments, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Asset not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Asset updated successfully' };
  } catch (error) {
    console.error('❌ Error updating asset:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete an asset by ID
/**
 * Deletes an asset record from the database.
 *
 * @async
 * @function deleteAsset
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - Request parameters.
 * @param {number|string} ctx.params.id - The property ID of the asset to delete.
 * @returns {Promise<void>} On success, ctx.body is set to a success message.
 * @throws {Error} If the deletion fails.
 */
exports.deleteAsset = async (ctx) => {
  try {
    /**
     * Deletes an asset from the database based on the provided property ID.
     *
     * @param {Object} ctx - The context object containing request parameters.
     * @param {Object} ctx.params - The parameters object.
     * @param {string} ctx.params.id - The ID of the property to delete.
     * @returns {Promise<Object>} The result of the delete query.
     * @throws {Error} If the query fails.
     */
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
    console.error('❌ Error deleting asset:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
