/**
 * Database initialization and models import.
 *
 * This module loads environment variables, sets up the Sequelize connection,
 * imports all models, and then exports them along with the Sequelize instance.
 *
 * @module models/index
 */
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load .env

const dbUrl = process.env.DB_CONNECTION_STRING;

if (!dbUrl) {
  throw new Error(
    '❌ Database connection string is missing. Check your .env file.'
  );
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'mariadb', // Ensure this matches your database
  logging: false, // Set to true for SQL query logs
});

// Import Models
const User = require('./user')(sequelize, DataTypes);
const Asset = require('./asset')(sequelize, DataTypes);
const Apartment = require('./apartment')(sequelize, DataTypes);
const Tenant = require('./tenant')(sequelize, DataTypes);
const Lease = require('./lease')(sequelize, DataTypes);
const Payment = require('./payment')(sequelize, DataTypes);
const MaintenanceRequest = require('./maintenance_request')(
  sequelize,
  DataTypes
);
const Notification = require('./notification')(sequelize, DataTypes);
const Inquiry = require('./inquiry')(sequelize, DataTypes);

// Export Database and Models
const db = {
  sequelize,
  Sequelize,
  User,
  Asset,
  Apartment,
  Tenant,
  Lease,
  Payment,
  MaintenanceRequest,
  Notification,
  Inquiry,
};

module.exports = db;
