const jwt = require('jsonwebtoken');

// Improved documentation for authenticateToken
/**
 * Middleware to authenticate requests by verifying the JWT provided in the Authorization header.
 *
 * @async
 * @function authenticateToken
 * @param {Object} ctx - The Koa context object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Sets ctx.state.user to the decoded token payload if authentication is successful.
 * @throws {JsonWebTokenError} If the token is invalid.
 */
exports.authenticateToken = async (ctx, next) => {
  const authHeader = ctx.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
    return;
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = user;
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = { error: 'Forbidden' };
  }
};

// Improved documentation for authorizeRoles
/**
 * Middleware factory to authorize requests based on user roles.
 *
 * @function authorizeRoles
 * @param {...string} allowedRoles - List of permitted user roles.
 * @returns {Function} Middleware that checks if the authenticated user's role is allowed.
 */
exports.authorizeRoles = (...allowedRoles) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!user || !allowedRoles.includes(user.role)) {
      ctx.status = 403;
      ctx.body = { error: 'Forbidden' };
      return;
    }
    await next();
  };
};
