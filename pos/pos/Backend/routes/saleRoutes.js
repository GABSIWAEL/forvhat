const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');

// Get all sales
// Get all sales
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all sales...');
        const sales = await Sale.findAll({
            include: [Customer]
        });
        console.log('Sales retrieved:', sales);
        res.json(sales);
    } catch (error) {
        console.error('Error retrieving sales:', error);
        res.status(500).json({ error: 'Unable to retrieve sales.' });
    }
});

// Get a specific sale
router.get('/:id', async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id, {
            include: [Customer]
        });
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ error: 'Sale not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve sale.' });
    }
});

// Create a new sale
router.post('/', async (req, res) => {
    try {
        const newSale = await Sale.create(req.body);
        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create sale.' });
    }
});

// Update a sale
router.put('/:id', async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (sale) {
            await sale.update(req.body);
            res.json(sale);
        } else {
            res.status(404).json({ error: 'Sale not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to update sale.' });
    }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id);
        if (sale) {
            await sale.destroy();
            res.json({ message: 'Sale deleted.' });
        } else {
            res.status(404).json({ error: 'Sale not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete sale.' });
    }
});

module.exports = router;
