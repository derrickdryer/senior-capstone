const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());

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

// Serve static files from the "app" directory
app.use(express.static(path.join(__dirname, '../../app')));

// Serve the index.html file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../app/pages/index.html'); // Go up 2 levels
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status || 500).send('Error loading the page');
    }
  });
});

app.get('/maintenance-info', (_, res) => {
  const filePath = path.join(__dirname, '../../app/pages/maintenance-info.html'); // Go up 2 levels
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status || 500).send('Error loading the page');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
