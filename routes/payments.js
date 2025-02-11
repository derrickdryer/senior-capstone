const Router = require('koa-router');
const paymentsController = require('../controllers/paymentsController');

const router = new Router();

// Define CRUD routes for payments
router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', paymentsController.createPayment);
router.put('/:id', paymentsController.updatePayment);
router.delete('/:id', paymentsController.deletePayment);

module.exports = router;