const pool = require('../database'); // Import MySQL connection

/**
 * Retrieves and returns all apartment records from the database.
 *
 * @async
 * @function getAllApartments
 * @param {Object} ctx - Koa context object.
 * @returns {Promise<void>} Sets ctx.body to an array of apartment objects.
 * @throws {Error} If the database query fails.
 */
exports.getAllApartments = async (ctx) => {
  try {
    console.log('✅ Fetching all apartments...');
    const [rows] = await pool.query('SELECT * FROM apartments');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching apartments:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves apartment records associated with a specific property.
 *
 * @async
 * @function getApartmentsByProperty
 * @param {Object} ctx - Koa context object containing query parameters.
 * @param {Object} ctx.params - Request parameters.
 * @param {string} ctx.params.propertyId - ID of the property.
 * @returns {Promise<void>} Sets ctx.body to an array of apartment objects.
 * @throws {Error} If the database query fails.
 */
exports.getApartmentsByProperty = async (ctx) => {
  try {
    console.log(
      `✅ Fetching apartments for property_id: ${ctx.params.propertyId}`
    );
    const [rows] = await pool.query(
      'SELECT * FROM apartments WHERE property_id = ?',
      [ctx.params.propertyId]
    );

    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching apartments by property:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves a specific apartment record by its ID.
 *
 * @async
 * @function getApartmentById
 * @param {Object} ctx - Koa context object containing parameters.
 * @param {Object} ctx.params - Request parameters.
 * @param {number} ctx.params.id - ID of the apartment.
 * @returns {Promise<void>} Sets ctx.body to the apartment object if found.
 * @throws {Error} If the database query fails.
 */
exports.getApartmentById = async (ctx) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM apartments WHERE apartment_id = ?',
      [ctx.params.id]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Apartment not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching apartment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Inserts a new apartment record into the database.
 *
 * @async
 * @function createApartment
 * @param {Object} ctx - Koa context object containing the request body.
 * @param {number} ctx.request.body.property_id - ID of the property.
 * @param {string} ctx.request.body.unit_number - Unit number.
 * @param {number} ctx.request.body.floor - Floor number.
 * @param {number} ctx.request.body.bedrooms - Number of bedrooms.
 * @param {number} ctx.request.body.bathrooms - Number of bathrooms.
 * @param {number} ctx.request.body.square_footage - Apartment square footage.
 * @param {number} ctx.request.body.rent_amount - Rent amount.
 * @returns {Promise<void>} Sets ctx.body with a message and apartment_id.
 * @throws {Error} If the database query fails.
 */
exports.createApartment = async (ctx) => {
  try {
    const {
      property_id,
      unit_number,
      floor,
      bedrooms,
      bathrooms,
      square_footage,
      rent_amount,
    } = ctx.request.body;
    const [result] = await pool.query(
      'INSERT INTO apartments (property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        property_id,
        unit_number,
        floor,
        bedrooms,
        bathrooms,
        square_footage,
        rent_amount,
      ]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'Apartment created successfully',
      apartment_id: result.insertId,
    };
  } catch (error) {
    console.error('❌ Error creating apartment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Updates an existing apartment record in the database.
 *
 * @async
 * @function updateApartment
 * @param {Object} ctx - Koa context object containing parameters and request body.
 * @param {Object} ctx.params - Request parameters.
 * @param {number} ctx.params.id - ID of the apartment to update.
 * @param {number} ctx.request.body.property_id - Updated property ID.
 * @param {string} ctx.request.body.unit_number - Updated unit number.
 * @param {number} ctx.request.body.floor - Updated floor number.
 * @param {number} ctx.request.body.bedrooms - Updated number of bedrooms.
 * @param {number} ctx.request.body.bathrooms - Updated number of bathrooms.
 * @param {number} ctx.request.body.square_footage - Updated square footage.
 * @param {number} ctx.request.body.rent_amount - Updated rent amount.
 * @returns {Promise<void>} Sets ctx.body with a success message.
 * @throws {Error} If the update query fails.
 */
exports.updateApartment = async (ctx) => {
  try {
    const {
      property_id,
      unit_number,
      floor,
      bedrooms,
      bathrooms,
      square_footage,
      rent_amount,
    } = ctx.request.body;
    const [result] = await pool.query(
      'UPDATE apartments SET property_id = ?, unit_number = ?, floor = ?, bedrooms = ?, bathrooms = ?, square_footage = ?, rent_amount = ? WHERE apartment_id = ?',
      [
        property_id,
        unit_number,
        floor,
        bedrooms,
        bathrooms,
        square_footage,
        rent_amount,
        ctx.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Apartment not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Apartment updated successfully' };
  } catch (error) {
    console.error('❌ Error updating apartment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Deletes an apartment record from the database.
 *
 * @async
 * @function deleteApartment
 * @param {Object} ctx - Koa context object containing parameters.
 * @param {Object} ctx.params - Request parameters.
 * @param {number} ctx.params.id - ID of the apartment to delete.
 * @returns {Promise<void>} Sets ctx.body with a success message upon deletion.
 * @throws {Error} If the delete query fails.
 */
exports.deleteApartment = async (ctx) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM apartments WHERE apartment_id = ?',
      [ctx.params.id]
    );
    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'Apartment not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Apartment deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting apartment:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
