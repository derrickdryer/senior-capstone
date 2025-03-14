const jwt = require('jsonwebtoken');
const pool = require('../database');
const { comparePassword } = require('../utils/passwordUtils');
// ... other required modules ...

function generateToken(user) {
  return jwt.sign(
    { id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

exports.login = async (ctx) => {
  try {
    const { username, password } = ctx.request.body;

    // ... your code to get the user from the database ...
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
    console.error('❌ Error during login', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal Server Error', message: error.message };
  }
};
