const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './databasesystem.db',
});

module.exports = sequelize;
