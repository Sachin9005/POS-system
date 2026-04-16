// ==================== PRODUCTS DATA ====================

export let products = [
  { sku: "PT001", name: "Lenovo IdeaPad 3", category: "Computers", stock: 100, price: 500, onOrderQty: 0 },
  { sku: "PT002", name: "Beats Pro", category: "Electronics", stock: 140, price: 1500, onOrderQty: 0 },
  { sku: "PT004", name: "Apple Series 5 Watch", category: "Electronics", stock: 450, price: 1000, onOrderQty: 0 },
  { sku: "PT005", name: "Amazon Echo Dot", category: "Electronics", stock: 320, price: 1200, onOrderQty: 0 },
  { sku: "PT008", name: "iPhone 14 Pro", category: "Phone", stock: 630, price: 100, onOrderQty: 0 }
];

let editingProductSKU = null;

// Render Table
export function renderProducts() {
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

window.showAddProductModal = showAddProductModal;
window.resetProductForm = resetProductForm;
window.hideProductModal = hideProductModal;
window.saveProduct = saveProduct;
window.searchProducts = searchProducts;
window.viewProduct = viewProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.renderProducts = renderProducts;
