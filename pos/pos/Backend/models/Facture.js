const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Product = require('./Product'); // Ensure correct path
const Sale = require('./Sale'); // Ensure correct path

const Facture = sequelize.define('Facture', {
    saleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sale,
            key: 'id'
        }
    },
    totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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

const FactureProduct = sequelize.define('FactureProduct', {
    factureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Facture,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['factureId', 'productId']
        }
    ]
});

// Associations
Facture.belongsTo(Sale, { foreignKey: 'saleId' });
Facture.belongsToMany(Product, { through: FactureProduct, foreignKey: 'factureId' });
Product.belongsToMany(Facture, { through: FactureProduct, foreignKey: 'productId' });

module.exports = { Facture, FactureProduct };
