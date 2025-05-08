const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite', '', '', {
    storage: './database.sqlite',
    logging: false,
    dialect: 'sqlite'
});

module.exports = sequelize;