const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Client = db.define('clients', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:  { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
}, { tableName: 'clients', timestamps: false });

module.exports = Client;