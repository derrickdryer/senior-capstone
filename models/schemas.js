/**
 * Dynamically initializes Sequelize models based on JSON schema definitions.
 *
 * Loads the database configuration and JSON schema definitions, and then
 * creates Sequelize models for each table defined in the schemas.
 *
 * @module models/schemas
 */
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../configs.json'); // Load database config
const schemasData = require('../models/schemas.json'); // Load JSON schema definitions

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
  }
);

// Dynamically define models based on JSON schema definitions
const models = {};

Object.keys(schemasData.schemas).forEach((tableName) => {
  models[tableName] = sequelize.define(
    tableName,
    // Build model attributes; default type is STRING. Customize as needed.
    Object.keys(schemasData.schemas[tableName]).reduce((acc, field) => {
      acc[field] = { type: DataTypes.STRING }; // Defaulting all fields to STRING, customize as needed
      return acc;
    }, {}),
    { tableName, timestamps: false }
  );
});

// Export dynamically defined models and the Sequelize instance
module.exports = { models, sequelize };
