const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db_example', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

// Models
const Product = require('../models/product');

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Define models
        Product.init(Product, sequelize);
        await sequelize.sync(); // Sync all defined models to the database
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, initializeDatabase, Product };
