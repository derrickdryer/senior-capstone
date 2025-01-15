const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const schemas = require('./schemas');

// Define models based on schemas
const models = Object.keys(schemas).reduce((acc, tableName) => {
  acc[tableName] = sequelize.define(tableName, schemas[tableName], { tableName, timestamps: false });
  return acc;
}, {});

module.exports = models;
