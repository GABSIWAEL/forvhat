const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve suppliers.' });
    }
});

// Get a specific supplier
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ error: 'Supplier not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve supplier.' });
    }
});

// Create a new supplier
router.post('/', async (req, res) => {
    try {
        const newSupplier = await Supplier.create(req.body);
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create supplier.' });
    }
});

// Update a supplier
router.put('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.update(req.body);
            res.json(supplier);
        } else {
            res.status(404).json({ error: 'Supplier not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to update supplier.' });
    }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.destroy();
            res.json({ message: 'Supplier deleted.' });
        } else {
            res.status(404).json({ error: 'Supplier not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete supplier.' });
    }
});

module.exports = router;
