const Router = require('koa-router');
const invoicesController = require('../controllers/invoicesController');

const router = new Router({ prefix: '/api/invoices' });

// Specific routes first:
router.get('/', invoicesController.getAllInvoices);
router.get(
  '/current-unpaid',
  invoicesController.getCurrentUnpaidInvoiceByLeaseId
);
router.get('/by-lease', invoicesController.getInvoicesByLeaseId);

// Dynamic route should come after specific routes.
router.get('/:id', invoicesController.getInvoiceById);

router.post('/', invoicesController.createInvoice);
router.put('/:id', invoicesController.updateInvoice);
router.delete('/:id', invoicesController.deleteInvoice);

module.exports = router;
