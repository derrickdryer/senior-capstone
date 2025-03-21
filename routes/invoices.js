const Router = require('koa-router');
const invoicesController = require('../controllers/invoicesController');

const router = new Router({
  prefix: '/api/invoices', // Set a prefix for all invoice routes
});

// Route to get all invoices
router.get('/', invoicesController.getAllInvoices);

// Route to get a specific invoice by ID
router.get('/:id', invoicesController.getInvoiceById);

// Route to get invoices by lease ID
router.get('/by-lease', invoicesController.getInvoicesByLeaseId);

// Route to create a new invoice
router.post('/', invoicesController.createInvoice);

// Route to update an existing invoice
router.put('/:id', invoicesController.updateInvoice);

// Route to delete an invoice
router.delete('/:id', invoicesController.deleteInvoice);

module.exports = router;