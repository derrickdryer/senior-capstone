const jwt = require('jsonwebtoken');

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
