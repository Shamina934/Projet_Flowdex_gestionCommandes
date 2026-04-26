const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Client  = require('./Client');
const Product = require('./Product');

const Order = db.define('orders', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  client_id: { type: DataTypes.INTEGER, allowNull: false },
  date:      { type: DataTypes.DATEONLY, allowNull: false },
  total:     { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
}, { tableName: 'orders', timestamps: false });

Order.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Order.belongsToMany(Product, {
  through: {
    model: 'order_products',
    timestamps: false,   // ← c'est ça qui règle l'erreur createdAt
  },
  foreignKey: 'order_id',
  as: 'products'
});

Product.belongsToMany(Order, {
  through: {
    model: 'order_products',
    timestamps: false,
  },
  foreignKey: 'product_id'
});

module.exports = Order;