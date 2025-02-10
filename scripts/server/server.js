const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const https = require('https');

dotenv.config();
const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../../public')));

// Serve JavaScript files with the correct MIME type
app.use('/components', express.static(path.join(__dirname, '../../app/components'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

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
app.use('/api/assets', assetsRoutes);
app.use('/api/apartments', apartmentsRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/leases', leasesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/maintenance-requests', maintenanceRequestsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Serve the index.html file at "/"
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../app/pages/index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Dynamic Route to Serve All Pages in `app/pages/`
app.get('/:page', (req, res) => {
  const requestedPage = req.params.page;
  const filePath = path.join(__dirname, `../../app/pages/${requestedPage}.html`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error loading ${requestedPage}:`, err);
      res.status(404).send('Page not found');
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).send('Internal Server Error');
});

// Load SSL certificate and key
const options = {
    key: fs.readFileSync(path.join(__dirname, '../../certs/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../../certs/server.crt'))
};

// Start the HTTPS server
const PORT = process.env.PORT || 3000;
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`🚀 HTTPS Server running on https://localhost:${PORT}`);
});