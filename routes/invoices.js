const Router = require('koa-router');
const invoicesController = require('../controllers/invoicesController');

const router = new Router({ prefix: '/api/invoices' });

// Existing routes...
router.get('/', invoicesController.getAllInvoices);
router.get('/:id', invoicesController.getInvoiceById);
router.get('/by-lease', invoicesController.getInvoicesByLeaseId);

// New route for fetching an invoice by both invoice_id and lease_id
router.get(
  '/by-lease-and-invoice',
  invoicesController.getInvoiceByLeaseAndInvoiceId
);

router.get(
  '/current-unpaid',
  invoicesController.getCurrentUnpaidInvoiceByLeaseId
);

router.post('/', invoicesController.createInvoice);
router.put('/:id', invoicesController.updateInvoice);
router.delete('/:id', invoicesController.deleteInvoice);

module.exports = router;
