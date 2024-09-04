const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Customer = require('./Customer'); // Ensure correct path

const Sale = sequelize.define('Sale', {
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    saleDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

Sale.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Sale, { foreignKey: 'customerId' });

module.exports = Sale;
