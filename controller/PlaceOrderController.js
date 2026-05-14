import {CustomerModel} from '../model/CustomerModel.js';
import {ItemModel} from '../model/ItemModel.js';
import { OrderDetailsModel } from '../model/OrderDetailsModel.js';
import { OrderModel } from '../model/OrderModel.js';

const customerModel = new CustomerModel();
const itemModel = new ItemModel();
const orderDetailsModel = new OrderDetailsModel();
const orderModel = new OrderModel();

let currentOrder = [];

export function renderSelects() {
  populatePlaceOrderDropdowns();

  const orderId = document.getElementById('orderId');
  const orderDate = document.getElementById('orderDate');
  if (orderId) orderId.value = getNextOrderId();
  if (orderDate) orderDate.value = new Date().toISOString().split('T')[0];

  resetItem();
  resetForm();
  calculateTotal();
}


// Dropdowns 
function populatePlaceOrderDropdowns() {
  const cusSelect = document.getElementById('customerSelect');
  if (cusSelect) {
    cusSelect.innerHTML = '<option value="">Select Customer</option>';
    customerModel.getAll().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.id})`;
      cusSelect.appendChild(opt);
    });
  }

  const itemSelect = document.getElementById('itemCode');
  if (itemSelect) {
    itemSelect.innerHTML = '<option value="">Select Item</option>';
    itemModel.getAll().forEach(p => {
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
  const cus = customerModel.getById(id);

  if (cus) {  
      document.getElementById('orderCusName').value = cus.name;
      document.getElementById('orderCusNIC').value = cus.nic;
      document.getElementById('orderCusAddress').value = cus.address;
  } else {
      document.getElementById('orderCusName').value = '';
      document.getElementById('orderCusNIC').value = '';
      document.getElementById('orderCusAddress').value = '';
  }
}

// Load Item
function loadItemInfo() {
  const sku = document.getElementById('itemCode').value;
  const prod = itemModel.getBySKU(sku);
  if (prod) {
    document.getElementById('itemName').value = prod.name;
    document.getElementById('unitPrice').value = prod.price;
    document.getElementById('qtyOnHand').value = prod.stock;
    calculateItemAmount();
  }else {
    document.getElementById('itemName').value = '';
    document.getElementById('unitPrice').value = '';
    document.getElementById('qtyOnHand').value = '';
    document.getElementById('itemAmount').value = '';
  }
}

// Add Item
function addItemToOrder() {
  const sku = document.getElementById('itemCode').value;
  const prod = itemModel.getBySKU(sku);
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
    existingItem.amount = parseFloat(existingItem.amount) + amount;
  } else {
    currentOrder.push({ sku, name: prod.name, qty, amount });
  }
  prod.onOrderQty = (prod.onOrderQty || 0) + qty;
  resetItem();
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

function adjustStock(sku, qtyChange) {
  const prod = itemModel.getBySKU(sku);
  if (!prod) return;
  prod.stock = Math.max(0, prod.stock + qtyChange);
  let isUpdated = itemModel.update(sku, prod);
  if (!isUpdated) {
    alert("Error updating stock!");
  }
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

function calculateItemAmount() {
  const price = parseFloat(document.getElementById('unitPrice').value) || 0;
  const qty = parseInt(document.getElementById('qty').value) || 0;
  document.getElementById('itemAmount').value = (price * qty).toFixed(2);
}

function calculateBalance() {
  const totalText = document.getElementById('totalAll') ? document.getElementById('totalAll').value : 'Rs. 0.00';
  const total = parseFloat(totalText.replace('Rs. ', '')) || 0;
  const cash = parseFloat(document.getElementById('cash').value) || 0;
  const balanceValue = (cash - total).toFixed(2);

  if (balanceValue < 0) {
    document.getElementById('balanceInput').value = `Rs. ${balanceValue} (Insufficient Cash)`;
    document.getElementById('balanceInput').style.color = '#ef4444';
  } else {
    document.getElementById('balanceInput').value = `Rs. ${balanceValue}`;
    document.getElementById('balanceInput').style.color = '#10b981';
  }

  const balanceDisplay = document.getElementById('balanceInput');
  if (balanceDisplay) balanceDisplay.value = `Rs. ${balanceValue}`;
}

function completePurchase() {
  if (currentOrder.length === 0) return alert("No items added!");
  const totalText = document.getElementById('totalAll').value || 'Rs. 0.00';
  const orderId = document.getElementById('orderId').value;
  const orderDate = document.getElementById('orderDate').value;
  const customerId = document.getElementById('customerSelect').value;
  const subTotalText = document.getElementById('subTotalInput').value || 'Rs. 0.00';
  const discount = parseFloat(document.getElementById('discount').value) || 0;

  const cash = parseFloat(document.getElementById('cash').value) || 0;
  const total = parseFloat(totalText.replace('Rs. ', '')) || 0;

  if (cash < total) {
    return alert("Insufficient cash!");
  }

  const orderData = {
    id: orderId,
    date: orderDate,
    customerId,
    total: parseFloat(totalText.replace('Rs. ', '')) || 0,
    sub_total: parseFloat(subTotalText.replace('Rs. ', '')) || 0,
    discount
  };

  let isOrderSaved = orderModel.save(orderData);

  if (!isOrderSaved) {
    return alert("Error saving order!");
  }

  currentOrder.forEach(item => {
    const detailData = {
      orderId,
      sku: item.sku,
      qty: item.qty,
      amount: item.amount
    };
    let isDetailSaved = orderDetailsModel.save(detailData);
    if (!isDetailSaved) {
      return alert("Error saving order details!");
    }
  });

  alert(`✅ Order Completed Successfully!\nTotal: ${totalText}`);

  currentOrder = [];
  renderProducts();
  renderOrderTable();
  calculateTotal();
  resetForm();
  resetItem();
  document.getElementById('cash').value = 0;
  calculateBalance();
}

function restoreStockFromOrder(orderItems) {
  orderItems.forEach(item => {
    adjustStock(item.sku, item.qty);
  });
}

function getNextOrderId() {
  const seed = String(new Date().getTime()).slice(-6);
  return `ORD${seed}`;
}

function removeItem(index) {
  const item = currentOrder[index];
  if (item) {
    adjustStock(item.sku, item.qty);
    const prod = itemModel.getBySKU(item.sku);
    if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
  }
  currentOrder.splice(index, 1);
  renderProducts();
  renderOrderTable();
  calculateTotal();
}


function voidOrder() {
  if (confirm("Void this order?")) {
    restoreStockFromOrder(currentOrder);
    currentOrder.forEach(item => {
      const prod = itemModel.getBySKU(item.sku);
      if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
    });
    currentOrder = [];
    renderProducts();
    renderOrderTable();
    calculateTotal();
  }
}

function cancelOrder() {
  if (confirm("Cancel this order?")) {
    restoreStockFromOrder(currentOrder);
    currentOrder = [];
    renderProducts();
    renderOrderTable();
    calculateTotal();
    resetForm();
  }
}

function resetForm() {
  const cusSelect = document.getElementById('customerSelect');
  if (cusSelect) cusSelect.value = '';

  const targetName = document.getElementById('orderCusName');
  const targetNIC = document.getElementById('orderCusNIC');
  const targetAddress = document.getElementById('orderCusAddress');

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
      const prod = itemModel.getBySKU(item.sku);
      if (prod) prod.onOrderQty = Math.max(0, (prod.onOrderQty || 0) - item.qty);
    });
    currentOrder = [];
    renderProducts();
    renderOrderTable();
    calculateTotal();
  }
}


window.renderCustomerSelect = renderSelects;
window.loadCustomerInfo = loadCustomerInfo;
window.loadItemInfo = loadItemInfo;
window.calculateItemAmount = calculateItemAmount;
window.addItemToOrder = addItemToOrder;
window.resetItem = resetItem;
window.resetForm = resetForm;
window.clearAllItems = clearAllItems;
window.calculateTotal = calculateTotal;
window.calculateBalance = calculateBalance;
window.completePurchase = completePurchase;
window.voidOrder = voidOrder;
window.cancelOrder = cancelOrder;
window.removeItem = removeItem;