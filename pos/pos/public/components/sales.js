    // sales.js

    // Ensure the script runs after the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
        initializeEventListeners();
        loadCustomers();
        loadAvailableProducts();
    });

    /**
     * Initialize all necessary event listeners
     */
    function initializeEventListeners() {
        const finalizeSaleBtn = document.getElementById('finalize-sale');
        const addNewCustomerBtn = document.getElementById('add-new-customer');
        const productSearchInput = document.getElementById('product-search');

        if (finalizeSaleBtn) {
            finalizeSaleBtn.addEventListener('click', processSale);
        } else {
            console.error('Finalize Sale button not found in the DOM.');
        }

        if (addNewCustomerBtn) {
            addNewCustomerBtn.addEventListener('click', toggleNewCustomerFields);
        } else {
            console.error('Add New Customer button not found in the DOM.');
        }

        if (productSearchInput) {
            productSearchInput.addEventListener('input', loadAvailableProducts);
        } else {
            console.error('Product search input not found in the DOM.');
        }
    }

    /**
     * Load customers from the server and populate the customer select dropdown
     */
    async function loadCustomers() {
        const customerSelect = document.getElementById('customer-select');

        if (!customerSelect) {
            console.error('Customer select element not found in the DOM.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/customers/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const customers = await response.json();

            // Clear existing options
            customerSelect.innerHTML = '<option value="">Select Existing Customer</option>';

            // Populate the select dropdown with customers
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.name} (${customer.phone})`;
                customerSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading customers:', error);
            alert('Failed to load customers. Please try again later.');
        }
    }

    /**
     * Load available products from the server and display them
     */
    async function loadAvailableProducts() {
        const productsContainer = document.getElementById('available-products');
        const productSearchInput = document.getElementById('product-search');

        if (!productsContainer || !productSearchInput) {
            console.error('Products container or search input not found in the DOM.');
            return;
        }

        const query = productSearchInput.value.trim();

        try {
            const response = await fetch(`http://localhost:3000/products/?search=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            // Clear existing products
            productsContainer.innerHTML = '';

            if (products.length === 0) {
                productsContainer.innerHTML = '<p>No products found.</p>';
                return;
            }

            // Display products
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <p><strong>${product.name}</strong></p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <p>Stock: ${product.stock}</p>
                    <div class="product-actions">
                        <input type="number" id="quantity-${product.id}" min="1" max="${product.stock}" value="1">
                        <button data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-stock="${product.stock}" class="add-to-facture">Add to Invoice</button>
                    </div>
                `;
                productsContainer.appendChild(productItem);
            });

            // Add event listeners to "Add to Invoice" buttons
            document.querySelectorAll('.add-to-facture').forEach(button => {
                button.addEventListener('click', addToFacture);
            });
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Failed to load products. Please try again later.');
        }
    }

    /**
     * Add selected product to the invoice (facture)
     */
    function addToFacture(event) {
        const button = event.target;
        const productId = button.dataset.id;
        const productName = button.dataset.name;
        const productPrice = parseFloat(button.dataset.price);
        const productStock = parseInt(button.dataset.stock);

        const quantityInput = document.getElementById(`quantity-${productId}`);
        const factureSection = document.getElementById('selected-products');
        const totalAmountElement = document.getElementById('total-amount');

        if (!quantityInput || !factureSection || !totalAmountElement) {
            console.error('Required elements for adding to facture are missing.');
            return;
        }

        let quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }

        if (quantity > productStock) {
            alert(`Requested quantity exceeds available stock. Available stock: ${productStock}`);
            return;
        }

        // Check if product is already in the invoice
        const existingProductRow = document.querySelector(`.facture-item[data-id="${productId}"]`);
        if (existingProductRow) {
            // Update existing product quantity and total
            const quantitySpan = existingProductRow.querySelector('.facture-quantity');
            const priceSpan = existingProductRow.querySelector('.facture-price');

            const existingQuantity = parseInt(quantitySpan.textContent);
            const newQuantity = existingQuantity + quantity;

            if (newQuantity > productStock) {
                alert(`Total quantity exceeds available stock. Available stock: ${productStock}`);
                return;
            }

            quantitySpan.textContent = newQuantity;
            priceSpan.textContent = `$${(newQuantity * productPrice).toFixed(2)}`;
        } else {
            // Add new product row to invoice
            const productRow = document.createElement('div');
            productRow.classList.add('facture-item');
            productRow.dataset.id = productId;
            productRow.innerHTML = `
                <span class="facture-product-name">${productName}</span>
                <span class="facture-quantity">${quantity}</span>
                <span class="facture-price">$${(quantity * productPrice).toFixed(2)}</span>
                <button class="remove-from-facture" data-id="${productId}">Remove</button>
            `;
            factureSection.appendChild(productRow);

            // Add event listener to remove button
            productRow.querySelector('.remove-from-facture').addEventListener('click', removeFromFacture);
        }

        // Update total amount
        const currentTotal = parseFloat(totalAmountElement.textContent) || 0;
        const newTotal = currentTotal + (quantity * productPrice);
        totalAmountElement.textContent = newTotal.toFixed(2);

        // Reset quantity input
        quantityInput.value = 1;
    }

    /**
     * Remove product from the invoice (facture)
     */
    function removeFromFacture(event) {
        const button = event.target;
        const productId = button.dataset.id;
        const productRow = document.querySelector(`.facture-item[data-id="${productId}"]`);
        const totalAmountElement = document.getElementById('total-amount');

        if (!productRow || !totalAmountElement) {
            console.error('Required elements for removing from facture are missing.');
            return;
        }

        const productPrice = parseFloat(productRow.querySelector('.facture-price').textContent.replace('$', ''));
        const currentTotal = parseFloat(totalAmountElement.textContent) || 0;
        const newTotal = currentTotal - productPrice;
        totalAmountElement.textContent = newTotal.toFixed(2);

        productRow.remove();
    }

    /**
     * Process the sale by sending data to the server
     */
    async function processSale() {
        const customerSelect = document.getElementById('customer-select');
        const customerNameInput = document.getElementById('customer-name');
        const customerPhoneInput = document.getElementById('customer-phone');
        const customerAddressInput = document.getElementById('customer-address');
        const factureItems = document.querySelectorAll('.facture-item');
        const totalAmountElement = document.getElementById('total-amount');

        if (!totalAmountElement || !customerSelect || !customerNameInput || !customerPhoneInput || !customerAddressInput) {
            console.error('Required elements for processing sale are missing.');
            return;
        }

        if (factureItems.length === 0) {
            alert('No products added to the invoice. Please add products before finalizing the sale.');
            return;
        }

        const totalAmount = parseFloat(totalAmountElement.textContent);

        let customerId = customerSelect.value;
        let isNewCustomer = false;

        let customerName = customerNameInput.value.trim();
        let customerPhone = customerPhoneInput.value.trim();
        let customerAddress = customerAddressInput.value.trim();

        // Validate customer information
        if (!customerId) {
            if (!customerName || !customerPhone || !customerAddress) {
                alert('Please provide complete customer information.');
                return;
            }

            isNewCustomer = true;
        }

        // Prepare sale data
        const products = Array.from(factureItems).map(item => {
            const productId = item.dataset.id;
            const productName = item.dataset.name || item.querySelector('.facture-product-name').textContent; // **Ensure productName is retrieved correctly**
            const quantity = parseInt(item.querySelector('.facture-quantity').textContent);
            const totalCost = parseFloat(item.querySelector('.facture-price').textContent.replace('$', ''));
            return { productId, quantity,productName, totalCost };
        });

        // Sale processing logic (within your existing processSale function)
        const saleData = {
            customerId,
            products,
            totalAmount,
            profit: products.reduce((acc, product) => {
                const productPrice = parseFloat(product.price); // Ensure price is a number
                const productCost = parseFloat(product.totalCost); // Use the correct totalCost
                const productProfit = (productPrice - productCost) * product.quantity; // Calculate profit per product
                return acc + productProfit;
            }, 0)
        };


        try {
            // If new customer, create customer first
            if (isNewCustomer) {
                const customerResponse = await fetch('http://localhost:3000/customers/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: customerName,
                        phone: customerPhone,
                        address: customerAddress
                    })
                });

                if (!customerResponse.ok) {
                    throw new Error('Failed to create new customer.');
                }

                const newCustomer = await customerResponse.json();
                saleData.customerId = newCustomer.id;
                customerName = newCustomer.name;
                customerPhone = newCustomer.phone;
                customerAddress = newCustomer.address;
            }

            // If the customer is existing, fetch their details if not provided
            if (!isNewCustomer) {
                const customerResponse = await fetch(`http://localhost:3000/customers/${customerId}`);
                const existingCustomer = await customerResponse.json();
                customerName = existingCustomer.name;
                customerPhone = existingCustomer.phone;
                customerAddress = existingCustomer.address;
            }

            // Create sale
            const saleResponse = await fetch('http://localhost:3000/sales/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });

            if (!saleResponse.ok) {
                throw new Error('Failed to process sale.');
            }

            const saleResult = await saleResponse.json();

            // Create facture
            const factureResponse = await fetch('http://localhost:3000/factures/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    saleId: saleResult.id,
                    totalCost: totalAmount,
                    products: products
                })
            });

            if (!factureResponse.ok) {
                throw new Error('Failed to create facture.');
            }

            const factureResult = await factureResponse.json();

            // Update product stocks on the server
            for (const product of products) {
                const updateStockResponse = await fetch(`http://localhost:3000/products/${product.productId}/reduce-stock`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: product.quantity })
                });

                if (!updateStockResponse.ok) {
                    console.warn(`Failed to update stock for product ID ${product.productId}.`);
                }
            }

            // Generate receipt-like PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 300]
            });

            doc.setFont("courier");

            // Store and transaction details
            doc.setFontSize(10);
            doc.text("Your Store Name", 5, 10);
            doc.text("Your Store Address Line 1", 5, 16);
            doc.text("Your Store Address Line 2", 5, 22);
            doc.text("Phone: +1234567890", 5, 28);

            doc.text("Date: " + new Date().toLocaleString(), 5, 34);

            doc.text("--------------------------------", 5, 40);

            // Customer details
            doc.text(`Customer: ${customerName}`, 5, 46);
            doc.text(`Phone: ${customerPhone}`, 5, 52);
            doc.text(`Address: ${customerAddress}`, 5, 58);

            doc.text("--------------------------------", 5, 64);

            // Product details
            let yPosition = 70;
            products.forEach((product, index) => {
                doc.text(`*****Item ${index + 1}*****`, 5, yPosition);
                doc.text(`Product Name: ${product.productName}`, 5, yPosition + 6);
                doc.text(`Quantity: ${product.quantity}`, 5, yPosition + 12);
                doc.text(`Price: $${product.totalCost.toFixed(2)}`, 5, yPosition + 18);
                yPosition += 24;

                if (yPosition > 290) {
                    doc.addPage([80, 300]);
                    yPosition = 10;
                }
            });

            doc.text("--------------------------------", 5, yPosition);

            // Total amount
            doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 5, yPosition + 6);

            // Footer
            doc.text("--------------------------------", 5, yPosition + 12);
            doc.text("Thank you for shopping with us!", 5, yPosition + 18);
            doc.save(` Receipt-For-Facture : _${factureResult.id}_Date : ${new Date().toLocaleString()}.pdf`);


            alert('Sale successfully processed!');

            // Reset the form and reload products and customers
            resetSaleForm();
            loadCustomers();
            loadAvailableProducts();
        } catch (error) {
            console.error('Error processing sale:', error);
            alert('Failed to process sale. Please try again later.');
        }
    }

    /**
     * Reset the sale form after successful transaction
     */
    function resetSaleForm() {
        document.getElementById('selected-products').innerHTML = '';
        document.getElementById('total-amount').textContent = '0.00';
        document.getElementById('customer-select').value = '';
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-address').value = '';
        document.getElementById('new-customer-fields').style.display = 'none';
        document.getElementById('product-search').value = '';
    }

    /**
     * Toggle visibility of new customer fields
     */
    function toggleNewCustomerFields() {
        const newCustomerFields = document.getElementById('new-customer-fields');

        if (!newCustomerFields) {
            console.error('New customer fields container not found in the DOM.');
            return;
        }

        if (newCustomerFields.style.display === 'none' || newCustomerFields.style.display === '') {
            newCustomerFields.style.display = 'block';
        } else {
            newCustomerFields.style.display = 'none';
        }
    }
