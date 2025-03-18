// File purpose: Defines routes for user management, including CRUD operations and authentication.
// Endpoints:
//   GET /by-username/:username      - Returns user details by username
//   GET /                           - Returns all users
//   GET /:id                        - Returns a specific user by id
//   POST /                          - Creates a new user
//   PUT /:id                        - Updates an existing user by id
//   DELETE /:id                     - Deletes a user
//   PUT /users/:id/password         - Updates a user's password
//   POST /login                     - Authenticates a user and returns a JWT
//   POST /register                  - Registers a new user

const Router = require('koa-router');
const usersController = require('../controllers/usersController');

const router = new Router();

// GET user by username
router.get('/by-username/:username', usersController.getUserByName);

// GET all users
router.get('/', usersController.getAllUsers);

// GET user by id
router.get('/:id', usersController.getUserById);

// Create a new user
router.post('/', usersController.createUser);

// Update an existing user
router.put('/:id', usersController.updateUser);

// Delete a user
router.delete('/:id', usersController.deleteUser);

// Update user's password
router.put('/users/:id/password', usersController.updatePassword);

// Login route for authentication
router.post('/login', usersController.login);

// Register route for new users
router.post('/register', usersController.register);

module.exports = router;
