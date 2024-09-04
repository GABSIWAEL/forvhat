    const express = require('express');
    const router = express.Router();
    const { Facture, FactureProduct } = require('../models/Facture');
    const Product = require('../models/Product');
    const Sale = require('../models/Sale');

    // Get all factures
    //const Facture = require('../models/Facture');

    // Get all factures
    router.get('/', async (req, res) => {
        try {
            console.log('Fetching all factures...');
            const factures = await Facture.findAll();
            console.log('Factures retrieved:', factures);
            res.json(factures);
        } catch (error) {
            console.error('Error retrieving factures:', error);
            res.status(500).json({ error: 'Unable to retrieve factures.' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const facture = await Facture.findByPk(req.params.id, {
                include: [
                    {
                        model: Product,
                        through: { attributes: ['quantity', 'totalCost'] }
                    }
                ]
            });
            console.log('Fetched facture:', facture);
            if (facture) {
                res.json(facture);
            } else {
                res.status(404).json({ error: 'Facture not found.' });
            }
        } catch (error) {
            console.error('Error retrieving facture:', error);
            res.status(500).json({ error: 'Unable to retrieve facture.' });
        }
    });




    // Create a new facture
    router.post('/', async (req, res) => {
        const { saleId, products } = req.body;
        console.log('Request Body:', req.body);

        try {
            let totalCost = 0;
            for (const product of products) {
                totalCost += product.totalCost;
            }

            // Create Facture
            const newFacture = await Facture.create({ saleId, totalCost });
            console.log('New Facture Created:', newFacture);

            // Create FactureProducts
            for (const product of products) {
                await FactureProduct.create({
                    factureId: newFacture.id,
                    productId: product.productId,
                    quantity: product.quantity,
                    totalCost: product.totalCost
                });

                const productRecord = await Product.findByPk(product.productId);
                if (productRecord) {
                    const newQuantity = productRecord.quantity - product.quantity;
                    await productRecord.update({ quantity: newQuantity });
                }
            }

            res.status(201).json(newFacture);
        } catch (error) {
            console.error('Error creating facture:', error);
            res.status(500).json({ error: 'Unable to create facture.' });
        }
    });

    // Update a facture
    router.put('/:id', async (req, res) => {
        try {
            const facture = await Facture.findByPk(req.params.id);
            if (facture) {
                await facture.update(req.body);
                res.json(facture);
            } else {
                res.status(404).json({ error: 'Facture not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Unable to update facture.' });
        }
    });

    // Delete a facture
    router.delete('/:id', async (req, res) => {
        try {
            const facture = await Facture.findByPk(req.params.id);
            if (facture) {
                await facture.destroy();
                res.json({ message: 'Facture deleted.' });
            } else {
                res.status(404).json({ error: 'Facture not found.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Unable to delete facture.' });
        }
    });
    router.post('/test', async (req, res) => {
        try {
            const testFacture = await Facture.create({ saleId: 1, totalCost: 100 });
            console.log('Test Facture Created:', testFacture);

            await FactureProduct.create({
                factureId: testFacture.id,
                productId: 1,
                quantity: 5,
                totalCost: 100
            });

            res.status(201).json(testFacture);
        } catch (error) {
            console.error('Test Error:', error);
            res.status(500).json({ error: 'Test failed.' });
        }
    });

    module.exports = router;
