const { hashPassword, comparePassword } = require('../utils/passwordUtils');
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

// Update user password
exports.updatePassword = async (ctx) => {
  try {
    const { password } = ctx.request.body;
    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, ctx.params.id]
    );

    if (result.affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: 'Password updated successfully' };
  } catch (error) {
    console.error('❌ Error updating password:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Login a user and verify password with hashed password
exports.login = async (ctx) => {
  try {
    const { username, password } = ctx.request.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid username or password' };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      message: 'Login successful',
      user_id: user.user_id,
      role: user.role,
    };
  } catch (error) {
    console.error('❌ Error during login:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Register a new user
exports.register = async (ctx) => {
  try {
    const { email, username, password } = ctx.request.body;

    if (!email || !username || !password) {
      ctx.status = 400;
      ctx.body = { error: 'All fields are required.' };
      return;
    }

    // Check if the username or email already exists
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existingUser.length > 0) {
      ctx.status = 409;
      ctx.body = { error: 'Username or email already exists.' };
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)',
      [email, username, hashedPassword, 'tenant']
    );

    ctx.status = 201;
    ctx.body = {
      message: 'Registration successful!',
      user_id: result[0].insertId,
    };
  } catch (error) {
    console.error('❌ Error during registration:', error);
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

// Get a single user by username
exports.getUserByName = async (ctx) => {
  try {
    const { username } = ctx.params;
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    if (rows.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = rows[0];
  } catch (error) {
    console.error('❌ Error fetching user by username:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

// Create a new user
exports.createUser = async (ctx) => {
  try {
    const { role, username, password, email } = ctx.request.body;
    const result = await pool.query(
      'INSERT INTO users (role, username, password, email) VALUES (?, ?, ?, ?)',
      [role, username, password, email]
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
    const { role, username, password, email } = ctx.request.body;
    const result = await pool.query(
      'UPDATE users SET role = ?, username = ?, password = ?, email = ? WHERE user_id = ?',
      [role, username, password, email, ctx.params.id]
    );
    if (result[0].affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
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
    const result = await pool.query('DELETE FROM users WHERE user_id = ?', [
      ctx.params.id,
    ]);
    if (result[0].affectedRows === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: 'User deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
