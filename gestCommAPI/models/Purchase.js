const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Product = require('./Product');

const Purchase = db.define('purchases', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id:     { type: DataTypes.INTEGER, allowNull: false },
  quantity:       { type: DataTypes.INTEGER, allowNull: false },
  purchase_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  date:           { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: 'purchases', timestamps: false });

Purchase.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = Purchase;