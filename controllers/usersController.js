/**
 * Utility functions for hashing and comparing passwords.
 * @module utils/passwordUtils
 * @requires ../utils/passwordUtils
 */
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const pool = require('../database');

/**
 * Retrieves all users from the database.
 *
 * @async
 * @function getAllUsers
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} Sets ctx.body with an array of user objects.
 * @throws {Error} If retrieving users fails.
 */
exports.getAllUsers = async (ctx) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    ctx.status = 200;
    ctx.body = rows;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Updates the password for a specified user.
 *
 * @async
 * @function updatePassword
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - An object containing the new password.
 * @param {string} ctx.request.body.password - The new password in plain text.
 * @param {Object} ctx.params - The URL parameters.
 * @param {number|string} ctx.params.id - The ID of the user whose password is to be updated.
 * @returns {Promise<void>} Sets ctx.body with a success message upon update.
 * @throws {Error} If the password update fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Registers a new user by inserting their details into the database.
 *
 * @async
 * @function register
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The registration details.
 * @param {string} ctx.request.body.email - The user's email address.
 * @param {string} ctx.request.body.username - The chosen username.
 * @param {string} ctx.request.body.password - The user's password.
 * @returns {Promise<void>} On success, sets ctx.body with a registration success message and the new user ID.
 * @throws {Error} If registration fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves a user by their unique ID.
 *
 * @async
 * @function getUserById
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique user identifier.
 * @returns {Promise<void>} On success, sets ctx.body with the user data.
 * @throws {Error} If retrieval fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Retrieves a user by their username.
 *
 * @async
 * @function getUserByName
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {string} ctx.params.username - The user's username.
 * @returns {Promise<void>} On success, sets ctx.body with the user data.
 * @throws {Error} If retrieval fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Creates a new user record in the database.
 *
 * @async
 * @function createUser
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The user details.
 * @param {string} ctx.request.body.role - The role of the user.
 * @param {string} ctx.request.body.username - The username.
 * @param {string} ctx.request.body.password - The user's password (should be hashed as necessary).
 * @param {string} ctx.request.body.email - The email address.
 * @returns {Promise<void>} On success, sets ctx.body with a creation success message and the new user ID.
 * @throws {Error} If user creation fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Updates an existing user's information.
 *
 * @async
 * @function updateUser
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The user ID to update.
 * @param {Object} ctx.request.body - The updated user details.
 * @param {string} ctx.request.body.role - The updated role.
 * @param {string} ctx.request.body.username - The updated username.
 * @param {string} ctx.request.body.password - The updated password.
 * @param {string} ctx.request.body.email - The updated email.
 * @returns {Promise<void>} On success, sets ctx.body with an update confirmation message.
 * @throws {Error} If the update fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Deletes a user from the database.
 *
 * @async
 * @function deleteUser
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.params - The route parameters.
 * @param {number|string} ctx.params.id - The unique identifier of the user to delete.
 * @returns {Promise<void>} On success, sets ctx.body with a deletion confirmation message.
 * @throws {Error} If deletion fails.
 */
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
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Handles password reset requests.
 * Generates a reset token and sends an email with a reset link.
 *
 * @async
 * @function forgotPassword
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} - Sends email with reset link.
 */ 
exports.forgotPassword = async (ctx) => {
  try {
    const { email } = ctx.request.body;

    if (!email) {
      ctx.status = 400;
      ctx.body = { error: 'Email is required.' };
      return;
    }

    // Check if user exists
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      ctx.status = 404;
      ctx.body = { error: 'User not found.' };
      return;
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 3600000); // 1-hour expiration

    // Store token in the database
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, tokenExpiration, email]
    );

    // Email transport configuration (Update with actual credentials)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    ctx.status = 200;
    ctx.body = { message: 'Password reset link sent to your email.' };
  } catch (error) {
    console.error('Forgot Password Error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};

/**
 * Resets the user's password using the provided reset token.
 *
 * @async
 * @function resetPassword
 * @param {Object} ctx - The Koa context object.
 * @returns {Promise<void>} - Updates user's password.
 */
exports.resetPassword = async (ctx) => {
  try {
    const { token, newPassword } = ctx.request.body;

    if (!token || !newPassword) {
      ctx.status = 400;
      ctx.body = { error: 'Token and new password are required.' };
      return;
    }

    // Check if the token is valid and not expired
    const [user] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (user.length === 0) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid or expired token.' };
      return;
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?',
      [hashedPassword, token]
    );

    ctx.status = 200;
    ctx.body = { message: 'Password reset successfully. You can now log in with your new password.' };
  } catch (error) {
    console.error('Reset Password Error:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};