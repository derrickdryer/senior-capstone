const Router = require('koa-router');
const apartmentsController = require('../controllers/apartmentsController');

const router = new Router();

// Define CRUD routes for apartments
router.get('/', apartmentsController.getAllApartments);
router.get('/:id', apartmentsController.getApartmentById);
router.post('/', apartmentsController.createApartment);
router.put('/:id', apartmentsController.updateApartment);
router.delete('/:id', apartmentsController.deleteApartment);
router.get('/property/:propertyId', apartmentsController.getApartmentsByProperty);


module.exports = router;
