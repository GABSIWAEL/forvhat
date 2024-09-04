const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./database');

// Middleware
app.use(cors({
    origin: 'http://localhost:5500', // Allow requests from this origin
    methods: ['GET', 'POST', 'DELETE', 'PUT'] // Specify allowed methods
}));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const factureRoutes = require('./routes/factureRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Use routes
app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use('/factures', factureRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/reports', reportRoutes);

sequelize.sync({ force: true  }) // or { force: true }
    .then(() => {
        console.log('Database schema synchronized.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error synchronizing the database schema:', err);
    });
