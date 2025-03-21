// ======================================================================
// File: server.js
// Description: Sets up a Koa server for serving static files and handling API routes.
//              This server applies middleware for parsing request bodies, serves static
//              assets with caching settings, handles dynamic routing for HTML pages,
//              and registers API endpoints for various application domains. It also
//              supports global error handling and optional SSL configuration.
// Dependencies: Koa, koa-router, koa-static, koa-mount, koa-bodyparser, dotenv, fs, path.
// Usage: Define environment variables in a .env file and run this script to start the server.
// ======================================================================

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = new Koa();
const router = new Router();

// Parse incoming request bodies (e.g., JSON payloads)
app.use(bodyParser());

// Serve static files from the "public" directory with caching headers.
// Ensures JavaScript files are served with the proper MIME type.
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

// Serve JavaScript components with caching and correct MIME type.
app.use(
  mount(
    '/components',
    serve(path.join(__dirname, '../../app/components'), {
      maxage: 24 * 60 * 60 * 1000, // Cache for 1 day
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    })
  )
);

// Serve JavaScript scripts similarly with caching and proper headers.
app.use(
  mount(
    '/scripts',
    serve(path.join(__dirname, '../../app/scripts'), {
      maxage: 24 * 60 * 60 * 1000, // Cache for 1 day
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    })
  )
);

// Import API route modules for various entities.
const assetsRoutes = require('../../routes/assets');
const apartmentsRoutes = require('../../routes/apartments');
const tenantsRoutes = require('../../routes/tenants');
const leasesRoutes = require('../../routes/leases');
const paymentsRoutes = require('../../routes/payments');
const maintenanceRequestsRoutes = require('../../routes/maintenance_requests');
const usersRoutes = require('../../routes/users');
const loginRoutes = require('../../routes/login'); // Handles authentication
const invoicesRoutes = require('../../routes/invoices');

// Register API routes with designated base paths.
router.use(assetsRoutes.routes());
router.use(apartmentsRoutes.routes());
router.use(tenantsRoutes.routes());
router.use(leasesRoutes.routes());
router.use(paymentsRoutes.routes());
router.use(maintenanceRequestsRoutes.routes());
router.use(usersRoutes.routes());
router.use(loginRoutes.routes());
router.use(invoicesRoutes.routes());

// Add the router middleware to handle routes and allowed methods.
app.use(router.routes()).use(router.allowedMethods());

// Serve the homepage (index.html) at the root URL.
router.get('/', async (ctx) => {
  const filePath = path.join(__dirname, '../../app/pages/index.html');
  ctx.type = 'html';
  ctx.body = fs.createReadStream(filePath);
});

// Dynamic route: Serves any HTML page located in app/pages based on the URL parameter.
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

// Specific route: Serves the property page based on property ID.
// Placed before the dynamic page route to ensure correct matching.
router.get('/property/:id', async (ctx) => {
  const filePath = path.join(__dirname, '../../app/pages/property.html');
  ctx.type = 'html';
  ctx.body = fs.createReadStream(filePath);
});

// Global error handler to catch and log unexpected server errors.
app.on('error', (err, ctx) => {
  console.error('Global Error Handler:', err);
  ctx.status = 500;
  ctx.body = 'Internal Server Error';
});

// Determine the port from environment variables (default to 3000).
let server;
const PORT = process.env.PORT || 3000;

// Uncomment and configure the following block to enable SSL/HTTPS for local development.
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

// Fallback: Ensure the server is listening.
if (!server.listening) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
