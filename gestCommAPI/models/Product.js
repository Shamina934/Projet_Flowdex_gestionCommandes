const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Product = db.define('products', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:        { type: DataTypes.STRING,  allowNull: false },
  price:       { type: DataTypes.DECIMAL(10,2), allowNull: false },
  description: { type: DataTypes.STRING },
}, { tableName: 'products', timestamps: false });

module.exports = Product;