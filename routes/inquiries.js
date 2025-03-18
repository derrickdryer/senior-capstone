// File purpose: Defines CRUD routes for inquiry management.
// Endpoints:
//   GET /      - Returns all inquiries
//   GET /:id   - Returns a specific inquiry by id
//   POST /     - Creates a new inquiry
//   PUT /:id   - Updates an existing inquiry by id
//   DELETE /:id - Deletes an inquiry by id

const Router = require('koa-router');
const inquiriesController = require('../controllers/inquiriesController');

const router = new Router();

// GET all inquiries
router.get('/', inquiriesController.getAllInquiries);

// GET inquiry by id
router.get('/:id', inquiriesController.getInquiryById);

// Create a new inquiry
router.post('/', inquiriesController.createInquiry);

// Update an existing inquiry
router.put('/:id', inquiriesController.updateInquiry);

// Delete an inquiry
router.delete('/:id', inquiriesController.deleteInquiry);

module.exports = router;
