const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Import Routes
const assetsRoutes = require('./routes/assets');
const apartmentsRoutes = require('./routes/apartments');
const tenantsRoutes = require('./routes/tenants');
const leasesRoutes = require('./routes/leases');
const paymentsRoutes = require('./routes/payments');
const maintenanceRequestsRoutes = require('./routes/maintenance_requests');
const usersRoutes = require('./routes/users');
const notificationsRoutes = require('./routes/notifications');
const inquiriesRoutes = require('./routes/inquiries');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/assets', assetsRoutes);
app.use('/api/apartments', apartmentsRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/leases', leasesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/maintenance-requests', maintenanceRequestsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Sync database and start server
sequelize
  .sync({ force: false }) // Set `force: true` to drop tables during dev
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
    );
  })
  .catch((err) => console.error('Error syncing database:', err));
