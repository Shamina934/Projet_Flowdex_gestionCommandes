const { DataTypes } = require('sequelize');
const db = require('../config/db');

const OrderProduct = db.define('order_products', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id:   { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
}, { tableName: 'order_products', timestamps: false });

module.exports = OrderProduct;