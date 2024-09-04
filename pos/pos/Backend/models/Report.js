    const { DataTypes } = require('sequelize');
    const sequelize = require('../database');

    const Report = sequelize.define('Report', {
        reportType: {
            type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        totalSales: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        totalPurchases: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        profit: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    module.exports = Report;
