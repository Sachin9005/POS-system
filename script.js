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

    // ==================== LOGIN ====================
    
    function login() {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (username === 'admin' && password === 'admin') {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        navigate('dashboard');
        updateDate();
        initChart();
      } else {
        alert('Invalid username or password. Try again.');
        document.getElementById('password').value = '';
        document.getElementById('username').value = '';
      }
    }

    // ==================== LOGIN / LOGOUT ====================

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

    // ==================== INITIALIZE ====================
    window.onload = () => {
      initSidebar();
      updateDate();
      renderProducts();
      renderCustomers();
    };

    // ==================== CUSTOMERS ====================


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

function showAddCustomerModal() {
  editingCustomerId = null;
  document.getElementById('addCustomerModal').classList.remove('hidden');
  document.querySelector('#addCustomerModal .modal-content h2').textContent = 'Add Customer';
  resetCustomerForm();
}

function getNextOrderId() {
  const seed = String(new Date().getTime()).slice(-6);
  return `ORD${seed}`;
}

function renderCustomerSelect() {
  populatePlaceOrderDropdowns();

  const orderId = document.getElementById('orderId');
  const orderDate = document.getElementById('orderDate');
  if (orderId) orderId.value = getNextOrderId();
  if (orderDate) orderDate.value = new Date().toISOString().split('T')[0];

  resetItem();
  resetForm();
  calculateTotal();
}


function searchCustomers() {
  const term = document.getElementById('customerSearch').value.toLowerCase();
  document.querySelectorAll('#customersTableBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
}

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

let products = [
  { sku: "PT001", name: "Lenovo IdeaPad 3", category: "Computers", stock: 100, price: 500, onOrderQty: 0 },
  { sku: "PT002", name: "Beats Pro", category: "Electronics", stock: 140, price: 1500, onOrderQty: 0 },
  { sku: "PT004", name: "Apple Series 5 Watch", category: "Electronics", stock: 450, price: 1000, onOrderQty: 0 },
  { sku: "PT005", name: "Amazon Echo Dot", category: "Electronics", stock: 320, price: 1200, onOrderQty: 0 },
  { sku: "PT008", name: "iPhone 14 Pro", category: "Phone", stock: 630, price: 100, onOrderQty: 0 }
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
      <td>Rs. ${(p.stock * p.price).toFixed(2)}</td>
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

//====place order====

// Place Order Variables
let currentOrder = [];

function adjustStock(sku, qtyChange) {
  const prod = products.find(p => p.sku === sku);
  if (!prod) return;
  prod.stock = Math.max(0, prod.stock + qtyChange);
}

function restoreStockFromOrder(orderItems) {
  orderItems.forEach(item => {
    adjustStock(item.sku, item.qty);
  });
}

// Populate Dropdowns
function populatePlaceOrderDropdowns() {
  const custSelect = document.getElementById('customerSelect');
  if (custSelect) {
    custSelect.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.id})`;
      custSelect.appendChild(opt);
    });
  }

  const itemSelect = document.getElementById('itemCode');
  if (itemSelect) {
    itemSelect.innerHTML = '<option value="">Select Item</option>';
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.sku;
      opt.textContent = `${p.sku} - ${p.name}`;
      itemSelect.appendChild(opt);
    });
  }
}

// Load Customer
function loadCustomerInfo() {
  const id = document.getElementById('customerSelect').value;
  const cust = customers.find(c => c.id === id);
  if (cust) {
    const targetName = document.getElementById('orderCustName');
    const targetNIC = document.getElementById('orderCustNIC');
    const targetAddress = document.getElementById('orderCustAddress');

    if (targetName) targetName.value = cust.name;
    if (targetNIC) targetNIC.value = cust.nic;
    if (targetAddress) targetAddress.value = cust.address;
  } else {
    document.getElementById('orderCustName').value = '';
    document.getElementById('orderCustNIC').value = '';
    document.getElementById('orderCustAddress').value = '';
  }
}


// Load Item
function loadItemInfo() {
  const sku = document.getElementById('itemCode').value;
  const prod = products.find(p => p.sku === sku);
  if (prod) {
    document.getElementById('itemName').value = prod.name;
    document.getElementById('unitPrice').value = prod.price;
    document.getElementById('qtyOnHand').value = prod.stock;
    calculateItemAmount();
  }
}

function calculateItemAmount() {
  const price = parseFloat(document.getElementById('unitPrice').value) || 0;
  const qty = parseInt(document.getElementById('qty').value) || 0;
  document.getElementById('itemAmount').value = (price * qty).toFixed(2);
}

// Add Item
function addItemToOrder() {
  const sku = document.getElementById('itemCode').value;
  const prod = products.find(p => p.sku === sku);
  if (!prod) return alert("Please select an item");

  let qty = parseInt(document.getElementById('qty').value, 10);
  if (isNaN(qty) || qty <= 0) {
    qty = 1;
    document.getElementById('qty').value = '1';
  }

  if (qty > prod.stock) return alert(`Insufficient stock. Available: ${prod.stock}`);

  const amount = parseFloat(document.getElementById('itemAmount').value) || 0;

  const existingItem = currentOrder.find(item => item.sku === sku);
  if (existingItem) {
    existingItem.qty += qty;
    existingItem.amount = (parseFloat(existingItem.amount) + amount).toFixed(2);
  } else {
    currentOrder.push({ sku, name: prod.name, qty, amount });
  }

  prod.onOrderQty = (prod.onOrderQty || 0) + qty;

  adjustStock(sku, -qty);
  renderProducts();
  document.getElementById('qtyOnHand').value = prod.stock;
  renderOrderTable();
  calculateTotal();
}

function renderOrderTable() {
  const tbody = document.getElementById('orderTableBody');
  tbody.innerHTML = '';
  currentOrder.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>Rs. ${item.amount}</td>
      <td><button onclick="removeItem(${i})" style="color:#ef4444;">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function removeItem(index) {
  const item = currentOrder[index];
  if (item) {
    adjustStock(item.sku, item.qty);
    const prod = products.find(p => p.sku === item.sku);
    if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
  }
  currentOrder.splice(index, 1);
  renderProducts();
  renderOrderTable();
  calculateTotal();
}

function calculateTotal() {
  let subTotal = currentOrder.reduce((sum, item) => sum + item.amount, 0);
  const discount = parseFloat(document.getElementById('discount').value) || 0;
  const total = subTotal * (1 - discount / 100);

  const subTotalDisplay = document.getElementById('subTotalInput');
  const totalDisplay = document.getElementById('totalAll');
  if (subTotalDisplay) subTotalDisplay.value = `Rs. ${subTotal.toFixed(2)}`;
  if (totalDisplay) totalDisplay.value = `Rs. ${total.toFixed(2)}`;

  const totalAmountField = document.getElementById('totalAmount');
  if (totalAmountField) totalAmountField.textContent = `Rs. ${total.toFixed(2)}`;

  calculateBalance();
}

function calculateBalance() {
  const totalText = document.getElementById('totalAll') ? document.getElementById('totalAll').value : 'Rs. 0.00';
  const total = parseFloat(totalText.replace('Rs. ', '')) || 0;
  const cash = parseFloat(document.getElementById('cash').value) || 0;
  const balanceValue = (cash - total).toFixed(2);

  const balanceDisplay = document.getElementById('balanceInput');
  if (balanceDisplay) balanceDisplay.value = `Rs. ${balanceValue}`;
}

function completePurchase() {
  if (currentOrder.length === 0) return alert("No items added!");
  const totalText = document.getElementById('totalAll').value || 'Rs. 0.00';
  alert(`✅ Order Completed Successfully!\nTotal: ${totalText}`);
  currentOrder.forEach(item => {
    const prod = products.find(p => p.sku === item.sku);
    if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
  });
  currentOrder = [];
  renderProducts();
  renderOrderTable();
  calculateTotal();
  resetForm();
  resetItem();
  document.getElementById('cash').value = 0;
  calculateBalance();
}

function voidOrder() {
  if (confirm("Void this order?")) {
    restoreStockFromOrder(currentOrder);
    currentOrder.forEach(item => {
      const prod = products.find(p => p.sku === item.sku);
      if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
    });
    currentOrder = [];
    renderProducts();
    renderOrderTable();
    calculateTotal();
  }
}

function cancelOrder() {
  if (confirm("Cancel this order?")) location.reload();
}

function resetForm() {
  const custSelect = document.getElementById('customerSelect');
  if (custSelect) custSelect.value = '';

  const targetName = document.getElementById('orderCustName');
  const targetNIC = document.getElementById('orderCustNIC');
  const targetAddress = document.getElementById('orderCustAddress');

  if (targetName) targetName.value = '';
  if (targetNIC) targetNIC.value = '';
  if (targetAddress) targetAddress.value = '';
}

function resetItem() {
  document.getElementById('itemCode').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('unitPrice').value = '';
  document.getElementById('qtyOnHand').value = '';
  document.getElementById('qty').value = '1';
  document.getElementById('itemAmount').value = '';
}

function clearAllItems() {
  if (confirm("Clear all items?")) {
    restoreStockFromOrder(currentOrder);
    currentOrder.forEach(item => {
      const prod = products.find(p => p.sku === item.sku);
      if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
    });
    currentOrder = [];
    renderProducts();
    renderOrderTable();
    calculateTotal();
  }
}