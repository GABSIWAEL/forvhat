const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './test.db',
});

const TestModel = sequelize.define('TestModel', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync({ force: true }); // Creates the table
        console.log('TestModel table created.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();
