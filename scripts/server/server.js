const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
// const http2 = require('http2'); // Commented out as it's not needed for HTTP

dotenv.config();
const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Serve static files from the "public" directory with caching headers
app.use(
  mount(
    '/public',
    serve(path.join(__dirname, '../../public'), {
      maxage: 24 * 60 * 60 * 1000, // Cache static assets for 1 day
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    })
  )
);

// Serve JavaScript files with the correct MIME type and caching headers
app.use(
  mount(
    '/components',
    serve(path.join(__dirname, '../../app/components'), {
      maxage: 24 * 60 * 60 * 1000, // Cache static assets for 1 day
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    })
  )
);

// Serve JavaScript files with the correct MIME type and caching headers
app.use(
  mount(
    '/scripts',
    serve(path.join(__dirname, '../../app/scripts'), {
      maxage: 24 * 60 * 60 * 1000, // Cache static assets for 1 day
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    })
  )
);

// Import Routes
const assetsRoutes = require('../../routes/assets');
const apartmentsRoutes = require('../../routes/apartments');
const tenantsRoutes = require('../../routes/tenants');
const leasesRoutes = require('../../routes/leases');
const paymentsRoutes = require('../../routes/payments');
const maintenanceRequestsRoutes = require('../../routes/maintenance_requests');
const usersRoutes = require('../../routes/users');
const notificationsRoutes = require('../../routes/notifications');
const inquiriesRoutes = require('../../routes/inquiries');

// Register Routes
router.use('/api/assets', assetsRoutes.routes());
router.use('/api/apartments', apartmentsRoutes.routes());
router.use('/api/tenants', tenantsRoutes.routes());
router.use('/api/leases', leasesRoutes.routes());
router.use('/api/payments', paymentsRoutes.routes());
router.use('/api/maintenance-requests', maintenanceRequestsRoutes.routes());
router.use('/api/users', usersRoutes.routes());
router.use('/api/notifications', notificationsRoutes.routes());
router.use('/api/inquiries', inquiriesRoutes.routes());

app.use(router.routes()).use(router.allowedMethods());

// Serve the index.html file at "/"
router.get('/', async (ctx) => {
  const filePath = path.join(__dirname, '../../app/pages/index.html');
  ctx.type = 'html';
  ctx.body = fs.createReadStream(filePath);
});

// Dynamic Route to Serve All Pages in `app/pages/`
router.get('/:page', async (ctx) => {
  const requestedPage = ctx.params.page;
  const filePath = path.join(
    __dirname,
    `../../app/pages/${requestedPage}.html`
  );
  try {
    if (fs.existsSync(filePath)) {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(filePath);
    } else {
      ctx.status = 404;
      ctx.body = 'Page not found';
    }
  } catch (err) {
    console.error(`Error loading ${requestedPage}:`, err);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

// Place this new route before the catch-all dynamic page route.
router.get('/property/:id', async (ctx) => {
  const filePath = path.join(__dirname, '../../app/pages/property.html');
  ctx.type = 'html';
  ctx.body = fs.createReadStream(filePath);
});

// Global Error Handler
app.on('error', (err, ctx) => {
  console.error('Global Error Handler:', err);
  ctx.status = 500;
  ctx.body = 'Internal Server Error';
});

// Load SSL certificate and key if USE_LOCAL_SSL is true
let server;
const PORT = process.env.PORT || 3000;

// Commented out SSL/HTTPS related code
// if (process.env.USE_LOCAL_SSL === 'true') {
//   const options = {
//     key: fs.readFileSync(path.join(__dirname, '../../certs/cloudflare.key')),
//     cert: fs.readFileSync(path.join(__dirname, '../../certs/cloudflare.crt'))
//   };
//   server = http2.createSecureServer(options, app.callback());
// } else {
server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  }
});
// }

// Start the server if it's not already listening
if (!server.listening) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
