async function loadProductsComponent() {
    const userForm = document.getElementById('product-form');
    const usersList = document.getElementById('product-list');
    const supplierSelect = document.getElementById('supplier-select');

    if (!userForm) {
        console.error('Form element not found.');
        return; // Stop execution if the form is not found
    }

    // Fetch and display all products and suppliers
    fetchProducts();
    fetchSuppliers();

    // Handle form submission to add a new product
// Handle form submission to add a new product
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const marque = document.getElementById('marque').value;
        const price = parseFloat(document.getElementById('price').value); // Convert to number
        const quantity = parseInt(document.getElementById('quantity').value, 10); // Convert to number
        const supplierId = parseInt(supplierSelect.value, 10); // Convert to number
        const priceOfSupplier = parseFloat(document.getElementById('priceOfSupplier').value); // Convert to number

        const newProduct = { name, marque, price, quantity, supplierId, priceOfSupplier };

        try {
            const response = await fetch('http://localhost:3000/products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                await fetchProducts(); // Refresh the product list
                userForm.reset(); // Clear the form
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Fetch and display all products
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/products/');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const products = await response.json();
            usersList.innerHTML = ''; // Clear the current list

            // Add the search input event listener
            const searchInput = document.querySelector('.search-field');
            searchInput.addEventListener('input', function () {
                const searchTerm = searchInput.value.toLowerCase();
                filterProducts(searchTerm, products);
            });

            renderProducts(products); // Initial render of products

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function fetchSuppliers() {
        try {
            const response = await fetch('http://localhost:3000/suppliers/');
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const suppliers = await response.json();

            // Populate the supplier select dropdown
            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                supplierSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    }

    function renderProducts(products) {
        usersList.innerHTML = ''; // Clear the current list
        const productDetail = document.createElement('table');
        productDetail.classList.add('styled-table'); // Add class for styling

        // Add the table header
        productDetail.innerHTML = `
    <thead>
        <tr>
            <th>Product Name</th>
            <th>Marque</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Price of Supplier</th>
            <th>Supplier</th>
            <th>ACTION</th>
        </tr>
    </thead>
    <tbody></tbody>`;

        const tbody = productDetail.querySelector('tbody');

        // Add table rows
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.marque}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.priceOfSupplier}</td>
            <td>${product.Supplier ? product.Supplier.name : 'N/A'}</td>
            <td>  <button onclick="deleteProduct(${product.id})">Delete</button></td>
        `;
            tbody.appendChild(row); // Append each row to tbody
        });

        // Append the complete table to the user list
        usersList.appendChild(productDetail);
    }

    function filterProducts(searchTerm, products) {
        // Filter products based on the search term
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts); // Re-render the table with filtered products
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

    // Call fetchProducts to load products when the page loads
    fetchProducts();

    // Delete a product
    window.deleteProduct = async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchProducts(); // Refresh the product list
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
}
