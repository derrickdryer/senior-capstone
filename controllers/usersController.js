const pool = require('../database');

// Get all users
exports.getAllUsers = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Get a single user by ID
exports.getUserById = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [
      ctx.params.id,
    ]);
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new user
exports.createUser = async (ctx) => {
  try {
    const { property_id, role, username, password, phone_number, mfa_secret } =
      ctx.request.body;
    const result = await pool.query(
      'INSERT INTO users (property_id, role, username, password, phone_number, mfa_secret) VALUES (?, ?, ?, ?, ?, ?)',
      [property_id, role, username, password, phone_number, mfa_secret]
    );
    ctx.status = 201;
    ctx.body = {
      message: 'User created successfully',
      user_id: result[0].insertId,
    };
  } catch (error) {
    console.error('❌ Error creating user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Update a user by ID
exports.updateUser = async (ctx) => {
  try {
    const { property_id, role, username, password, phone_number, mfa_secret } =
      ctx.request.body;
    await pool.query(
      'UPDATE users SET property_id = ?, role = ?, username = ?, password = ?, phone_number = ?, mfa_secret = ? WHERE user_id = ?',
      [
        property_id,
        role,
        username,
        password,
        phone_number,
        mfa_secret,
        ctx.params.id,
      ]
    );
    ctx.status = 200;
    ctx.body = { message: 'User updated successfully' };
  } catch (error) {
    console.error('❌ Error updating user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Delete a user by ID
exports.deleteUser = async (ctx) => {
  try {
    await pool.query('DELETE FROM users WHERE user_id = ?', [ctx.params.id]);
    ctx.status = 200;
    ctx.body = { message: 'User deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
