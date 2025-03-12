const Router = require('koa-router');
const usersController = require('../controllers/usersController');

const router = new Router();

router.get('/by-username/:username', usersController.getUserByName);

// Define CRUD routes for users
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.post('/login', usersController.login);
router.post('/register', usersController.register);

module.exports = router;
