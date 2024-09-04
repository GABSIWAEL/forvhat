async function fetchReport(reportType) {
    try {
        const response = await fetch(`http://localhost:3000/reports/${reportType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the report.');
        }

        const reportData = await response.json();
        console.log(reportData);  // Log the response to see its structure

        displayReport(reportData);
    } catch (error) {
        console.error('Error fetching report:', error);
        alert('Failed to fetch the report. Please try again later.');
    }
}
function displayReport(reportData) {
    const reportTable = document.getElementById('reportTable');

    // Clear existing table content
    reportTable.innerHTML = '';

    // Check if reportData is an array
    if (Array.isArray(reportData)) {
        // Create table headers
        const headers = `
            <tr>
                <th>Date</th>
                <th>Total Sales</th>
                <th>Total Profit</th>
                <th>Number of Transactions</th>
            </tr>`;
        reportTable.insertAdjacentHTML('beforeend', headers);

        // Populate table rows with report data
        reportData.forEach((report) => {
            const row = `
                <tr>
                    <td>${new Date(report.date).toLocaleDateString()}</td>
                    <td>$${report.totalSales.toFixed(2)}</td>
                    <td>$${report.totalProfit.toFixed(2)}</td>
                    <td>${report.transactionCount}</td>
                </tr>`;
            reportTable.insertAdjacentHTML('beforeend', row);
        });
    } else {
        reportTable.innerHTML = '<tr><td colspan="4">No data available.</td></tr>';
    }
}
