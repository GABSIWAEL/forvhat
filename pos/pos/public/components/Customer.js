function loadCustomersComponent() {
    const custForm = document.getElementById('cust-form');
    const CustomList = document.getElementById('Custom-List');

    if (!custForm) {
        console.error('Form element not found.');
        return; // Stop execution if the form is not found
    }

    // Fetch and display all products
    fetchCustomers();

    // Handle form submission to add a new product
    custForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const clientType = document.getElementById('clientType').value;
        const phone = document.getElementById('phone').value;

        const newCustomer = { name, clientType, phone };

        try {
            const response = await fetch('http://localhost:3000/customers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });

            if (response.ok) {
                await fetchCustomers(); // Refresh the product list
                custForm.reset(); // Clear the form
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Fetch and display all products
    async function fetchCustomers() {
        try {
            const response = await fetch('http://localhost:3000/customers/');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const customers = await response.json();
            CustomList.innerHTML = ''; // Clear the current list

            // Add the search input event listener
            const searchInput = document.querySelector('.search-field');
            searchInput.addEventListener('input', function () {
                const searchTerm = searchInput.value.toLowerCase();
                filterCustomers(searchTerm, customers);
            });

            renderCustomers(customers); // Initial render of products

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function renderCustomers(customers) {
        CustomList.innerHTML = ''; // Clear the current list
        const customDetail = document.createElement('table');
        customDetail.classList.add('styled-table'); // Add class for styling

        // Add the table header
        customDetail.innerHTML = `
    <thead>
        <tr>
            <th>Customer Name</th>
            <th>Customer Type</th>
            <th>Phone</th>
            <th>ACTION</th>
        </tr>
    </thead>
    <tbody></tbody>`;

        const tbody = customDetail.querySelector('tbody');

        // Add table rows
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.clientType}</td>
            <td>${customer.phone}</td>  
            <td>  <button onclick="deleteCustomer(${customer.id})">Delete</button></td>
        `;
            tbody.appendChild(row); // Append each row to tbody
        });

        // Append the complete table to the user list
        CustomList.appendChild(customDetail);
    }

    function filterCustomers(searchTerm, customers) {
        // Filter products based on the search term
        const filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm)
        );
        renderCustomers(filteredCustomers); // Re-render the table with filtered products
    }

// Add CSS styles (keep the same as before)
    const style = document.createElement('style');
    style.innerHTML = `
    .styled-table {
        border-collapse: collapse;
        margin: 25px 0;
        font-size: 18px;
        font-family: Arial, sans-serif;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        width: 100%;
    }
    .styled-table thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: center;
    }
    .styled-table th, .styled-table td {
        padding: 12px 15px;
    }
    .styled-table tbody tr {
        border-bottom: 1px solid #dddddd;
    }
    .styled-table tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }
    .styled-table tbody tr:last-of-type {
        border-bottom: 2px solid #009879;
    }
    .styled-table tbody tr:hover {
        background-color: #f1f1f1;
    }
`;
    document.head.appendChild(style); // Append styles to the document

// Call fetchCustomers to load products when the page loads
    fetchCustomers();


    // Delete a product
    window.deleteCustomer = async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/customers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchCustomers(); // Refresh the product list
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
}
