const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestion_commandes', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;