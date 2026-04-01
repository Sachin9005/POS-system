    // ==================== NAVIGATION ====================
    function navigate(page) {
      document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
      document.querySelectorAll('.sidebar ul li').forEach(item => item.classList.remove('active'));

      const section = document.getElementById(page + 'Section');
      if (section) section.classList.remove('hidden');

      document.querySelector(`[data-page="${page}"]`).classList.add('active');

      if (page === 'place-order') renderCustomerSelect();
      if (page === 'products') renderProducts();
      if (page === 'customers') renderCustomers();
    }

    function initSidebar() {
      document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.addEventListener('click', () => {
          navigate(item.getAttribute('data-page'));
        });
      });
    }

    // ==================== LOGIN / LOGOUT ====================
    function login() {
      document.getElementById('loginPage').classList.add('hidden');
      document.getElementById('mainApp').classList.remove('hidden');
      navigate('dashboard');
      updateDate();
      initChart();
    }

    function logout() {
      document.getElementById('mainApp').classList.add('hidden');
      document.getElementById('loginPage').classList.remove('hidden');
      currentOrder = [];
    }

    // ==================== CHART ====================
    let overviewChart;
    function initChart() {
      const ctx = document.getElementById('overviewChart');
      if (overviewChart) overviewChart.destroy();

      overviewChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
          datasets: [{
            data: [18, 25, 55, 48, 52, 38, 58, 32, 38],
            borderColor: '#fb923c',
            backgroundColor: 'rgba(251, 146, 60, 0.2)',
            tension: 0.4,
            borderWidth: 4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { min: 10, max: 60, ticks: { color: '#94a3b8' } } }
        }
      });
    }

    // ==================== DATE ====================
    function updateDate() {
      const dateEl = document.getElementById('currentDate');
      dateEl.textContent = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    }

    // ==================== PLACE ORDER FUNCTIONS ====================
    function renderCustomerSelect() {
      const select = document.getElementById('customerSelect');
      select.innerHTML = '<option value="">Select Customer</option>';
      customers.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.phone})`;
        select.appendChild(opt);
      });
    }

    function addItemToOrder() {
      alert("Item selection modal will open here (Add your modal code)");
      // You can expand this later
    }

    function calculateTotal() {
      let subtotal = 50000; // Example
      document.getElementById('subTotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
      document.getElementById('grandTotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    }

    function completePurchase() {
      if (currentOrder.length === 0) return alert("No items added!");
      alert("✅ Order Completed Successfully!");
      currentOrder = [];
    }

    function clearOrder() {
      if (confirm("Clear order?")) currentOrder = [];
    }

    // Placeholder functions
    function loadCustomerInfo() {}
    function renderProducts() { console.log("Products rendered"); }
    function renderCustomers() { console.log("Customers rendered"); }

    // ==================== INITIALIZE ====================
    window.onload = () => {
      initSidebar();
      updateDate();
    };

    // ==================== CUSTOMERS ====================

   // ==================== CUSTOMERS CRUD ====================

let customers = [
  { id: "CU001", name: "Kasun Perera", nic: "12498345785", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" },
  { id: "CU002", name: "Nimali Silva", nic: "13178964582", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" },
  { id: "CU003", name: "Ruwan Fernando", nic: "12796183487", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" }
];

let editingCustomerId = null;   // To track which customer is being edited

function renderCustomers() {
  const tbody = document.getElementById('customersTableBody');
  tbody.innerHTML = '';

  customers.forEach(cust => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cust.id}</td>
      <td>${cust.name}</td>
      <td>${cust.nic}</td>
      <td>${cust.address}</td>
      <td>${cust.phone}</td>
      <td><span class="status-active">Active</span></td>
      <td class="actions">
        <button onclick="viewCustomer('${cust.id}')" class="action-btn view" title="View">👁</button>
        <button onclick="editCustomer('${cust.id}')" class="action-btn edit" title="Edit">✏️</button>
        <button onclick="deleteCustomer('${cust.id}')" class="action-btn delete" title="Delete">🗑</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Show Add Customer Modal

// Edit Customer
function editCustomer(id) {
  const customer = customers.find(c => c.id === id);
  if (!customer) return;

  editingCustomerId = id;

  document.getElementById('addCustomerModal').classList.remove('hidden');
  document.querySelector('.modal-content h2').textContent = "Edit Customer";

  document.getElementById('custID').value = customer.id;
  document.getElementById('custName').value = customer.name;
  document.getElementById('custNIC').value = customer.nic;
  document.getElementById('custPhone').value = customer.phone;
  document.getElementById('custAddress').value = customer.address;
}

// View Customer (Simple Alert for now)
function viewCustomer(id) {
  const customer = customers.find(c => c.id === id);
  if (customer) {
    alert(`Customer Details:\n\nID: ${customer.id}\nName: ${customer.name}\nNIC: ${customer.nic}\nPhone: ${customer.phone}\nAddress: ${customer.address}`);
  }
}

// Delete Customer
function deleteCustomer(id) {
  if (confirm(`Are you sure you want to delete Customer ${id}?`)) {
    customers = customers.filter(c => c.id !== id);
    renderCustomers();
    alert("Customer deleted successfully!");
  }
}

// Save Customer (Add or Update)
function saveCustomer() {
  const name = document.getElementById('custName').value.trim();
  if (!name) {
    alert("Customer Name is required!");
    return;
  }

  const customerData = {
    id: editingCustomerId || "CU" + String(customers.length + 1).padStart(3, '0'),
    name: name,
    nic: document.getElementById('custNIC').value || "N/A",
    phone: document.getElementById('custPhone').value || "+94 71 000 0000",
    address: document.getElementById('custAddress').value || "No address provided"
  };

  if (editingCustomerId) {
    // Update existing customer
    const index = customers.findIndex(c => c.id === editingCustomerId);
    if (index !== -1) customers[index] = customerData;
  } else {
    // Add new customer
    customers.unshift(customerData);
  }

  hideModal();
  renderCustomers();
  alert(editingCustomerId ? "✅ Customer updated successfully!" : "✅ Customer added successfully!");
}

// Reset Form
function resetCustomerForm() {
  document.getElementById('custID').value = editingCustomerId || "CU" + String(customers.length + 1).padStart(3, '0');
  document.getElementById('custName').value = '';
  document.getElementById('custNIC').value = '';
  document.getElementById('custPhone').value = '';
  document.getElementById('custAddress').value = '';
}

// Hide Modal
function hideModal() {
  document.getElementById('addCustomerModal').classList.add('hidden');
  editingCustomerId = null;
}

// ==================== PRODUCTS DATA ====================
// ==================== PRODUCTS CRUD ====================
let products = [
  { sku: "PT001", name: "Lenovo IdeaPad 3", category: "Computers", stock: 100, price: 500 },
  { sku: "PT002", name: "Beats Pro", category: "Electronics", stock: 140, price: 1500 },
  { sku: "PT004", name: "Apple Series 5 Watch", category: "Electronics", stock: 450, price: 1000 },
  { sku: "PT005", name: "Amazon Echo Dot", category: "Electronics", stock: 320, price: 1200 },
  { sku: "PT008", name: "iPhone 14 Pro", category: "Phone", stock: 630, price: 100 }
];

let editingProductSKU = null;

// Render Table
function renderProducts() {
  const tbody = document.getElementById('productsTableBody');
  tbody.innerHTML = '';

  products.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.stock}</td>
      <td>05</td>
      <td>Rs. ${p.price}</td>
      <td class="actions">
        <button onclick="viewProduct('${p.sku}')" class="action-btn view" title="View">👁</button>
        <button onclick="editProduct('${p.sku}')" class="action-btn edit" title="Edit">✏️</button>
        <button onclick="deleteProduct('${p.sku}')" class="action-btn delete" title="Delete">🗑</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// View Product
function viewProduct(sku) {
  const p = products.find(x => x.sku === sku);
  if (p) {
    alert(`📦 Product Details:\n\nSKU: ${p.sku}\nName: ${p.name}\nCategory: ${p.category}\nStock: ${p.stock}\nPrice: Rs. ${p.price}`);
  }
}

// Edit Product
function editProduct(sku) {
  const product = products.find(p => p.sku === sku);
  if (!product) return;

  editingProductSKU = sku;
  document.getElementById('productModalTitle').textContent = "Edit Item";
  document.getElementById('addProductModal').classList.remove('hidden');

  document.getElementById('prodSKU').value = product.sku;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodStock').value = product.stock;
  document.getElementById('prodPrice').value = product.price;
}

// Add New Product
function showAddProductModal() {
  editingProductSKU = null;
  document.getElementById('productModalTitle').textContent = "Add New Item";
  document.getElementById('addProductModal').classList.remove('hidden');
  resetProductForm();
}

// Save Product (Add or Update)
function saveProduct() {
  const name = document.getElementById('prodName').value.trim();
  if (!name) {
    alert("Product Name is required!");
    return;
  }

  const productData = {
    sku: editingProductSKU || "PT" + String(100 + products.length).padStart(3, '0'),
    name: name,
    category: document.getElementById('prodCategory').value || "General",
    stock: parseInt(document.getElementById('prodStock').value) || 0,
    price: parseFloat(document.getElementById('prodPrice').value) || 0
  };

  if (editingProductSKU) {
    // Update
    const index = products.findIndex(p => p.sku === editingProductSKU);
    if (index !== -1) products[index] = productData;
  } else {
    // Add new
    products.unshift(productData);
  }

  hideProductModal();
  renderProducts();
  alert(editingProductSKU ? "✅ Product Updated Successfully!" : "✅ Product Added Successfully!");
}

// Delete Product
function deleteProduct(sku) {
  if (confirm(`Delete product ${sku}?`)) {
    products = products.filter(p => p.sku !== sku);
    renderProducts();
    alert("✅ Product Deleted!");
  }
}

// Helper Functions
function hideProductModal() {
  document.getElementById('addProductModal').classList.add('hidden');
  editingProductSKU = null;
}

function resetProductForm() {
  document.getElementById('prodSKU').value = editingProductSKU || "PT" + String(100 + products.length).padStart(3, '0');
  document.getElementById('prodName').value = '';
  document.getElementById('prodCategory').value = '';
  document.getElementById('prodStock').value = '';
  document.getElementById('prodPrice').value = '';
}

function searchProducts() {
  const term = document.getElementById('productSearch').value.toLowerCase();
  document.querySelectorAll('#productsTableBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
}