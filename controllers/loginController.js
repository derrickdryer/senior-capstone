const jwt = require('jsonwebtoken');
const pool = require('../database');
const { comparePassword } = require('../utils/passwordUtils');

// Improved documentation for generateToken
/**
 * Generates a JSON Web Token (JWT) for a user.
 *
 * @param {Object} user - The user object.
 * @param {number} user.user_id - Unique identifier for the user.
 * @param {string} user.username - The username.
 * @param {string} user.role - The user role.
 * @returns {string} A signed JWT valid for 1 hour.
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Improved documentation for login
/**
 * Authenticates a user using their credentials and issues a JWT if successful.
 *
 * @async
 * @function login
 * @param {Object} ctx - The Koa context object.
 * @param {Object} ctx.request.body - The login credentials.
 * @param {string} ctx.request.body.username - The username of the user.
 * @param {string} ctx.request.body.password - The user's password.
 * @returns {Promise<void>} On success, sets ctx.status to 200 and returns a JSON containing a success message and JWT.
 * @throws {Error} If authentication fails or a database error occurs.
 */
exports.login = async (ctx) => {
  try {
    const { username, password } = ctx.request.body;
    // ...existing code to query the database...
    /**
     * Retrieves the user record matching the specified username.
     *
     * @param {string} username - The username to search.
     * @returns {Promise<Array>} Resolves with an array containing the user record.
     * @throws {Error} If the database query fails.
     */
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

    const token = generateToken(user);
    ctx.status = 200;
    ctx.body = {
      message: 'Login successful',
      token,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
