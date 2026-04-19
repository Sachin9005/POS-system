import { ItemModel } from "../model/ItemModel.js";

const itemModel = new ItemModel();

let editingProductSKU = null;

const itemRegex = {
    itemSKU: /^[A-Z0-9\-_]{3,20}$/,
    itemName: /^[a-zA-Z0-9\s&\-.,()]{3,100}$/,
    category: /^[a-zA-Z\s&\-]{2,50}$/,
    price: /^\d+(\.\d{1,2})?$/, 
    quantity: /^\d+$/,
};

// Render Table
export function renderProducts() {
  const tbody = document.getElementById('productsTableBody');
  tbody.innerHTML = '';

  itemModel.getAll().forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.sku}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.stock}</td>
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
  const product = itemModel.getBySKU(sku);
  document.getElementById('viewProdSKU').value = product.sku;
  document.getElementById('viewProdName').value = product.name;
  document.getElementById('viewProdCategory').value = product.category;
  document.getElementById('viewProdStock').value = product.stock;
  document.getElementById('viewProdPrice').value = product.price.toFixed(2);
  document.getElementById('showProductModal').classList.remove('hidden');
}

function deleteProduct(sku) {
  if (confirm(`Delete product ${sku}?`)) {
   let isDeleted = itemModel.delete(sku);
    if (!isDeleted) {
      alert("Error: Product not found!");
      return;
    }
    renderProducts();
    alert("Product deleted successfully!"); 
  }
}

// Edit Product
function editProduct(sku) {
  const product = itemModel.getBySKU(sku);
  if (!product)  {
    alert("Error: Product not found!");
    return;
  }

  editingProductSKU = sku;
  document.getElementById('productModalTitle').textContent = "Edit Item";
  document.getElementById('addProductModal').classList.remove('hidden');

  document.getElementById('prodSKU').value = product.sku;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodStock').value = product.stock;
  document.getElementById('prodPrice').value = product.price;
}

// Save Product (Add or Update)
function saveProduct() {
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value.trim();
  const stock = document.getElementById('prodStock').value.trim();
  const price = document.getElementById('prodPrice').value.trim();

  if (!itemRegex.itemName.test(name)) {
    alert("Invalid product name!");
    return;
  }
  if (category && !itemRegex.category.test(category)) {
    alert("Invalid category!");
    return;
  }
  if (!itemRegex.quantity.test(stock) || parseInt(stock) < 0) {
    alert("Invalid stock quantity!");
    return;
  }
  if (!itemRegex.price.test(price) || parseFloat(price) < 0) {
    alert("Invalid price!");
    return;
  }

  const productData = {
    sku: editingProductSKU || itemModel.createSKU(),
    name: name,
    category: category,
    stock: parseInt(stock),
    price: parseFloat(price)
  };
  if (editingProductSKU) {
    let isUpdated = itemModel.update(editingProductSKU, productData);

    if (isUpdated) {
      alert("Product updated successfully!");
    }else {
      alert("Error updating product!");
    }
  } else {
    let isSaved = itemModel.save(productData);
    if (isSaved) {
      alert("Product added successfully!");
    } else {
      alert("Error adding product!");
    }
  }
  hideProductModal();
  renderProducts(); 
  resetProductForm();
}

// Helper Functions
function hideProductModal() {
  document.getElementById('addProductModal').classList.add('hidden');
  document.getElementById('showProductModal').classList.add('hidden');
  editingProductSKU = null;
}

function resetProductForm() {
  document.getElementById('prodSKU').value = editingProductSKU || itemModel.createSKU();
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

// Add New Product
function showAddProductModal() {
  editingProductSKU = null;
  document.getElementById('productModalTitle').textContent = "Add New Item";
  document.getElementById('addProductModal').classList.remove('hidden');
  resetProductForm();
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
