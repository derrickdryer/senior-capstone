// routes/payments.js

const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentsController');

// GET all payments
router.get('/', getAllPayments);

// GET a single payment by ID
router.get('/:id', getPaymentById);

// POST create a new payment
router.post('/', createPayment);

// PUT update a payment by ID
router.put('/:id', updatePayment);

// DELETE a payment by ID
router.delete('/:id', deletePayment);

module.exports = router;