const pool = require('../database'); // Import MySQL connection

// Get all apartments
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

// Get apartments by property ID
exports.getApartmentsByProperty = async (ctx) => {
  try {
    console.log(`✅ Fetching apartments for property_id: ${ctx.params.propertyId}`);
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


// Get a single apartment by ID
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

// Create a new apartment
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

// Update an apartment by ID
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

// Delete an apartment by ID
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
