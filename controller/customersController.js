    // ==================== CUSTOMERS ====================


export let customers = [
  { id: "CU001", name: "Kasun Perera", nic: "12498345785", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" },
  { id: "CU002", name: "Nimali Silva", nic: "13178964582", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" },
  { id: "CU003", name: "Ruwan Fernando", nic: "12796183487", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" }
];

let editingCustomerId = null;   // To track which customer is being edited

export function renderCustomers() {
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

window.showAddCustomerModal = showAddCustomerModal;
window.resetCustomerForm = resetCustomerForm;
window.hideModal = hideModal;
window.saveCustomer = saveCustomer;
window.searchCustomers = searchCustomers;
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;