/**
 * Middleware module for request body validation using express-validator.
 *
 * This module exports middleware specifically designed to validate tenant data.
 *
 * @module middleware/validate
 * @requires express-validator
 */
const { body, validationResult } = require('express-validator');

exports.validateTenant = [
  body('first_name')
    .isString()
    .notEmpty()
    .withMessage('First name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  // Middleware function to check for validation errors.
  // If errors exist, it returns a 400 response with error details.
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
