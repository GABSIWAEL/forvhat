const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Supplier = require("../models/Supplier");

// Get all products
// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Supplier,
                attributes: ['name'] // Include supplier name
            }]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve products.' });
    }
});


// Reduce stock of a product
// Reduce stock of a product
router.post('/:id/reduce-stock', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            const { stock } = req.body;
            if (product.Quantity >= stock) {
                product.Quantity -= stock;
                await product.save();
                res.json(product);
            } else {
                res.status(400).json({ error: 'Insufficient stock.' });
            }
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to reduce stock.' });
    }
});

// Get a specific product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve product.' });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create product.' });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.update(req.body);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to update product.' });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            await product.destroy();
            res.json({ message: 'Product deleted.' });
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete product.' });
    }
});

module.exports = router;
