const { body, validationResult } = require('express-validator');

exports.validateTenant = [
  body('first_name').isString().notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
