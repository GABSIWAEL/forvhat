const Sales = require('../models/Sale');
const { Op } = require('sequelize');
const { Facture, FactureProduct } = require('../models/Facture');

async function getReportByType(type) {
    let startDate;

    switch (type) {
        case 'shiftly':
            startDate = new Date(new Date() - 8 * 60 * 60 * 1000); // Last 8 hours
            break;
        case 'daily':
            startDate = new Date(new Date() - 24 * 60 * 60 * 1000); // Last 24 hours
            break;
        case 'weekly':
            startDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
            break;
        case 'halfmonth':
            startDate = new Date(new Date().setDate(new Date().getDate() - 15)); // Last 15 days
            break;
        case 'monthly':
            startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)); // Last month
            break;
        case 'trimestry':
            startDate = new Date(new Date().setMonth(new Date().getMonth() - 3)); // Last 3 months
            break;
        case 'semestry':
            startDate = new Date(new Date().setMonth(new Date().getMonth() - 6)); // Last 6 months
            break;
        case 'yearly':
            startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)); // Last year
            break;
        default:
            throw new Error('Invalid report type.');
    }

    const sales = await Sales.findAll({
        where: {
            createdAt: {
                [Op.gte]: startDate
            }
        },
        include: [{
            model: Facture,   // Ensure this now works
            include: [FactureProduct]  // Ensure nested inclusion works as well
        }]
    });

    let totalSales = 0;
    let totalProfit = 0;
    let transactionCount = sales.length;

    sales.forEach(sale => {
        totalSales += sale.totalAmount;

        sale.Factures.forEach(facture => {
            facture.FactureProducts.forEach(fp => {
                const productCost = fp.totalCost;
                const productPrice = sale.totalAmount / facture.FactureProducts.length; // Assuming equal price for simplicity
                totalProfit += (productPrice - productCost) * fp.quantity;
            });
        });
    });

    return [{
        totalSales,
        totalProfit,
        transactionCount,
        date: startDate
    }];
}

module.exports = {
    getReportByType
};
