// controllers/paymentsController.js

const { payments } = require('../models');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const results = await payments.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await payments.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const newPayment = await payments.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing payment by ID
exports.updatePayment = async (req, res) => {
  try {
    const payment = await payments.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const payment = await payments.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
