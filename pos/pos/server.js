const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5500
app.use(cors()); // Enable CORS for all routes


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,  'public',   'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});