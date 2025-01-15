// routes/inquiries.js

const express = require('express');
const router = express.Router();
const {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiriesController');

// GET all inquiries
router.get('/', getAllInquiries);

// GET a single inquiry by ID
router.get('/:id', getInquiryById);

// POST create a new inquiry
router.post('/', createInquiry);

// PUT update an inquiry by ID
router.put('/:id', updateInquiry);

// DELETE an inquiry by ID
router.delete('/:id', deleteInquiry);

module.exports = router;
