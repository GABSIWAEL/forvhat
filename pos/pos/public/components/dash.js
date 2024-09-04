
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
clock = () => {
    let today = new Date();
    let h = (today.getHours() % 12) + today.getMinutes() / 59; // 22 % 12 = 10pm
    let m = today.getMinutes(); // 0 - 59
    let s = today.getSeconds(); // 0 - 59

    h *= 30; // 12 * 30 = 360deg
    m *= 6;
    s *= 6; // 60 * 6 = 360deg
    
    rotation(hours, h);
    rotation(minutes, m);
    rotation(seconds, s);

    // call every second
    setTimeout(clock, 500);
}

rotation = (target, val) => {
    target.style.transform =  `rotate(${val}deg)`;
}

window.onload = clock();


function getProfit() {
    return undefined;
}

function getPaid() {
    return undefined;
}

function getUnpaid() {
    return undefined;
}

function getHalfPaid() {
    return undefined;
}

// Fetch and update elements dynamically
function updateDashboard() {
    // Example of calling external functions to get data
    const sales = getSales(); // Assume getSales() is defined in another file

    const products = getProducts(); // Assume getProducts() is defined in another file
    const revenue = getRevenue(); // Assume getRevenue() is defined in another file
    const profit = getProfit(); // Assume getProfit() is defined in another file
    const paid = getPaid(); // Assume getPaid() is defined in another file
    const unpaid = getUnpaid(); // Assume getUnpaid() is defined in another file
    const halfPaid = getHalfPaid(); // Assume getHalfPaid() is defined in another file

    // Update the elements with the fetched data
    document.getElementById('sales-value').textContent = sales;
    document.getElementById('products-value').textContent = products;
    document.getElementById('revenue-value').textContent = revenue;
    document.getElementById('profit-value').textContent = profit;
    document.getElementById('paid-value').textContent = paid;
    document.getElementById('unpaid-value').textContent = unpaid;
    document.getElementById('half-paid-value').textContent = halfPaid;
}

// Example function to get sales (replace with actual data fetching)
function getSales() {
    return 150; // Example value
}
function getProducts() {
    return undefined;
}
function getRevenue() {
    return undefined;
}


// Similarly define other functions to get products, revenue, etc.

// Call the update function when the page loads
document.addEventListener('DOMContentLoaded', updateDashboard);

// Example button functions
function exportPDF() {
    // Code to export PDF
    console.log("Exporting PDF...");
}

function importData() {
    // Code to import data
    console.log("Importing Data...");
}

function showStatistics() {
    // Code to show statistics
    console.log("Showing Statistics...");
}

function showHistory() {
    // Code to show history
    console.log("Showing History...");
}
