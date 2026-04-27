const { DataTypes } = require('sequelize');
const db           = require('../config/db');
const Client       = require('./Client');
const Product      = require('./Product');
const OrderProduct = require('./OrderProduct');

const Order = db.define('orders', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  client_id: { type: DataTypes.INTEGER, allowNull: false },
  date:      { type: DataTypes.DATEONLY, allowNull: false },
  total:     { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
}, { tableName: 'orders', timestamps: false });

Order.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: 'order_id',
  otherKey: 'product_id',
  as: 'products'
});

Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: 'product_id',
  otherKey: 'order_id'
});

module.exports = Order;