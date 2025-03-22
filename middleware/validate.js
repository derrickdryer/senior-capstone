const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('manager', 'maintenance', 'tenant').required(),
  // ...other fields...
});

const registerUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('tenant').required(),
  // ...other fields...
});

const updateUserSchema = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('manager', 'maintenance', 'tenant').optional(),
  // ...other fields...
});

function validateBody(schema) {
  return async (ctx, next) => {
    const { error, value } = schema.validate(ctx.request.body, {
      abortEarly: false,
    });
    if (error) {
      ctx.status = 400;
      ctx.body = { errors: error.details.map((err) => err.message) };
      return;
    }
    ctx.request.body = value;
    await next();
  };
}

module.exports = {
  validateCreateUser: validateBody(createUserSchema),
  validateUpdateUser: validateBody(updateUserSchema),
  validateRegisterUser: validateBody(registerUserSchema),
  // ...export other validators as needed...
};
