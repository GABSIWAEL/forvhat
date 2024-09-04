// routes/reports.js

const express = require('express');
const router = express.Router();
const reportService = require('../service/reportService');

// Route to fetch reports based on the type
router.get('/:type', async (req, res) => {
    const reportType = req.params.type;

    try {
        const reportData = await reportService.getReportByType(reportType);
        res.json(reportData);
    } catch (error) {
        console.error(`Error fetching ${reportType} report:`, error);
        res.status(500).json({ message: 'Failed to fetch report.' });
    }
});

module.exports = router;
