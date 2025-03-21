// File purpose: Defines CRUD routes for apartment management.
// Endpoints:
//   GET /                 - Returns all apartments
//   GET /:id              - Returns a specific apartment by id
//   POST /                - Creates a new apartment
//   PUT /:id              - Updates an existing apartment by id
//   DELETE /:id           - Deletes an apartment by id
//   GET /property/:propertyId - Returns apartments associated with a property

const Router = require('koa-router');
const apartmentsController = require('../controllers/apartmentsController');
const { authenticateToken } = require('../middleware/auth');

const router = new Router({ prefix: '/api/apartments' });

// GET all apartments
router.get('/', apartmentsController.getAllApartments);

// GET apartment by id
router.get('/:id', apartmentsController.getApartmentById);

// Create a new apartment
router.post('/', authenticateToken, apartmentsController.createApartment);

// Update an existing apartment
router.put('/:id', authenticateToken, apartmentsController.updateApartment);

// Delete an apartment
router.delete('/:id', authenticateToken, apartmentsController.deleteApartment);

// GET apartments by property id
router.get(
  '/property/:propertyId',
  apartmentsController.getApartmentsByProperty
);

module.exports = router;
