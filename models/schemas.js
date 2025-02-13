const { Sequelize, DataTypes } = require('sequelize');
const config = require('../configs.json'); // Load database config
const schemasData = require('../models/schemas.json'); // Load JSON schema definitions

// Initialize Sequelize
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
  }
);

// Define models dynamically based on schemas.json
const models = {};

Object.keys(schemasData.schemas).forEach((tableName) => {
  models[tableName] = sequelize.define(
    tableName,
    Object.keys(schemasData.schemas[tableName]).reduce((acc, field) => {
      acc[field] = { type: DataTypes.STRING }; // Defaulting all fields to STRING, customize as needed
      return acc;
    }, {}),
    { tableName, timestamps: false }
  );
});

module.exports = { models, sequelize };
