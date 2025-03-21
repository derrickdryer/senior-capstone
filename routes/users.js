const Router = require('koa-router');
const usersController = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateUser,
  validateUpdateUser,
} = require('../middleware/validate');

const router = new Router({ prefix: '/api/users' });

// Protect all routes except login and register (if desired, adjust as needed)
router.use(authenticateToken);

// GET user by username
router.get('/by-username/:username', usersController.getUserByName);

// GET all users
router.get('/', usersController.getAllUsers);

// GET user by id
router.get('/:id', usersController.getUserById);

// Create a new user with validation
router.post('/', validateCreateUser, usersController.createUser);

// Update an existing user with validation
router.put('/:id', validateUpdateUser, usersController.updateUser);

// Delete a user
router.delete('/:id', usersController.deleteUser);

// Update user's password (consider applying custom validation for password)
router.put('/:id/password', usersController.updatePassword);

// Login route for authentication (typically unprotected)
router.post('/login', usersController.login);

// Register route for new users (consider adding validation similar to createUser)
router.post('/register', validateCreateUser, usersController.register);

module.exports = router;
