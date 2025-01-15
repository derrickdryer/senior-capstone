// controllers/inquiriesController.js

const { inquiries } = require('../models');

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const results = await inquiries.findAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single inquiry by ID
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await inquiries.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const newInquiry = await inquiries.create(req.body);
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing inquiry by ID
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await inquiries.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    await inquiry.update(req.body);
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an inquiry by ID
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await inquiries.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    await inquiry.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};