const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// Define CRUD routes for payments
router.get('/', paymentsController.getAllPayments);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', paymentsController.createPayment);
router.put('/:id', paymentsController.updatePayment);
router.delete('/:id', paymentsController.deletePayment);

module.exports = router;
