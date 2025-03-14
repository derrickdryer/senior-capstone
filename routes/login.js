const Router = require('koa-router');
const loginController = require('../controllers/loginController');

const router = new Router();

// Public login route (no middleware)
router.post('/', loginController.login);

module.exports = router;
