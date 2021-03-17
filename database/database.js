const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'mysql*pass',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;