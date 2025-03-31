// File purpose: Defines CRUD routes for payment management.
// Endpoints:
//   GET /      - Returns all payments
//   GET /:id   - Returns a specific payment by id
//   POST /     - Creates a new payment
//   PUT /:id   - Updates an existing payment by id
//   DELETE /:id - Deletes a payment

const Router = require('koa-router');
const paymentsController = require('../controllers/paymentsController');
const { authenticateToken } = require('../middleware/auth');
const {
  validateCreatePayment,
  validateUpdatePayment,
} = require('../middleware/validate');

const router = new Router({ prefix: '/api/payments' });

router.use(authenticateToken);

// GET all payments
router.get('/', paymentsController.getAllPayments);

// GET payment by id
router.get('/:id', paymentsController.getPaymentById);

// Create a new payment
router.post('/', validateCreatePayment, paymentsController.createPayment);

// Update an existing payment
router.put('/:id', validateUpdatePayment, paymentsController.updatePayment);

// Delete a payment
router.delete('/:id', paymentsController.deletePayment);

module.exports = router;
