const Router = require('koa-router');
const usersController = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateUser,
  validateUpdateUser,
  validateRegisterUser,
} = require('../middleware/validate');

const router = new Router({ prefix: '/api/users' });

// GET user by username
router.get(
  '/by-username/:username',
  usersController.getUserByName,
  authenticateToken
);

// GET all users
router.get('/', usersController.getAllUsers, authenticateToken);

// GET user by id
router.get('/:id', usersController.getUserById, authenticateToken);

// Create a new user with validation
router.post(
  '/',
  validateCreateUser,
  usersController.createUser,
  authenticateToken
);

// Update an existing user with validation
router.put(
  '/:id',
  validateUpdateUser,
  usersController.updateUser,
  authenticateToken
);

// Delete a user
router.delete('/:id', usersController.deleteUser, authenticateToken);

// Update user's password (consider applying custom validation for password)
router.put('/:id/password', usersController.updatePassword, authenticateToken);

// Update user's email (consider applying custom validation for email)
router.put('/:id/email', usersController.updateEmail, authenticateToken);

// Register route for new users (consider adding validation similar to createUser)
router.post('/register', validateRegisterUser, usersController.register);

module.exports = router;
