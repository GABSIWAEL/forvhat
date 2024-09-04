const sequelize = require('../database');
const User = require('./User');
const Customer = require('./Customer');
const Product = require('./Product');
const { Facture, FactureProduct } = require('./Facture');
const Sale = require('./Sale');
const Supplier = require('./Supplier');
const Report = require('./Report');

// Define associations
Sale.hasOne(Facture, {
    foreignKey: 'saleId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Facture.belongsTo(Sale, {
    foreignKey: 'saleId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Facture.belongsToMany(Product, { through: FactureProduct, foreignKey: 'factureId' });
Product.belongsToMany(Facture, { through: FactureProduct, foreignKey: 'productId' });

Product.belongsTo(Supplier, { foreignKey: 'supplierId' });
Supplier.hasMany(Product, { foreignKey: 'supplierId' });

module.exports = {
    User,
    Customer,
    Product,
    Facture,
    FactureProduct,
    Sale,
    Supplier,
    Report
};
