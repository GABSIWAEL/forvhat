const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve customers.' });
    }
});

// Get a specific customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve customer.' });
    }
});

// Create a new customer
router.post('/', async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create customer.' });
    }
});

// Update a customer
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            await customer.update(req.body);
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to update customer.' });
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            await customer.destroy();
            res.json({ message: 'Customer deleted.' });
        } else {
            res.status(404).json({ error: 'Customer not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete customer.' });
    }
});

module.exports = router;
