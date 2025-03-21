// File purpose: Defines the public login route for user authentication.
// Endpoints:
//   POST / - Authenticates a user and returns a JWT token

const Router = require('koa-router');
const loginController = require('../controllers/loginController');

const router = new Router({ prefix: '/api/login' });

// POST login for user authentication
router.post('/', loginController.login);

module.exports = router;
