import { CustomerModel } from '../model/CustomerModel.js';

const customerRegex = {
  name: /^[a-zA-Z\s.\-']{2,100}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(?:\+94|0)[0-9]{9}$/,
  nic: /^(\d{9}[VX]|\d{12})$/i,
  address: /^[a-zA-Z0-9\s,.\-\/#]{5,200}$/
};

const customerModel = new CustomerModel();

let editingCustomerId = null;

export function renderCustomers() {
  const tbody = document.getElementById('customersTableBody');
  tbody.innerHTML = '';

  customerModel.getAll().forEach(cus => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cus.id}</td>
      <td>${cus.name}</td>
      <td>${cus.nic}</td>
      <td>${cus.address}</td>
      <td>${cus.phone}</td>
      <td><span class="status-active">Active</span></td>
      <td class="actions">
        <button onclick="viewCustomer('${cus.id}')" class="action-btn view" title="View">👁</button>
        <button onclick="editCustomer('${cus.id}')" class="action-btn edit" title="Edit">✏️</button>
        <button onclick="deleteCustomer('${cus.id}')" class="action-btn delete" title="Delete">🗑</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// View Customer
function viewCustomer(id) {
  const customer = customerModel.getById(id);
  document.getElementById('viewCusID').value = customer.id;
  document.getElementById('viewCusName').value = customer.name;
  document.getElementById('viewCusNIC').value = customer.nic;
  document.getElementById('viewCusPhone').value = customer.phone;
  document.getElementById('viewCusAddress').value = customer.address;
  document.getElementById('showCustomerModal').classList.remove('hidden');
  
}

// Delete Customer
function deleteCustomer(id) {
  if (confirm(`Are you sure you want to delete Customer ${id}?`)) {
    let isDeleted = customerModel.delete(id);
    if (!isDeleted) {
      alert("Error: Customer not found!");
      return;
    }
    renderCustomers();
    alert("Customer deleted successfully!");
  }
}

// Edit Customer
function editCustomer(id) {
  const customer = customerModel.getById(id);
  if (!customer) {
    alert("Error: Customer not found!");
    return;
  }

  editingCustomerId = id;
  document.getElementById('addCustomerModal').classList.remove('hidden');
  document.querySelector('#addCustomerModal .modal-content h2').textContent = 'Edit Customer';
  
  document.getElementById('cusID').value = customer.id;
  document.getElementById('cusName').value = customer.name;
  document.getElementById('cusNIC').value = customer.nic;
  document.getElementById('cusPhone').value = customer.phone;
  document.getElementById('cusAddress').value = customer.address; 
}

// Save Customer (Add or Update)
function saveCustomer() {
  const name = document.getElementById('cusName').value.trim();
  const nic = document.getElementById('cusNIC').value.trim();
  const phone = document.getElementById('cusPhone').value.trim();
  const address = document.getElementById('cusAddress').value.trim();

  if (!customerRegex.name.test(name)) {
    alert("Invalid name!");
    return;
  }
  if (!customerRegex.nic.test(nic)) {
    alert("Invalid NIC!");
    return;
  }
  if (!customerRegex.phone.test(phone)) {
    alert("Invalid phone number!");
    return;
  }
  if (!customerRegex.address.test(address)) {
    alert("Invalid address!");
    return;
  }

  const customerData = {
    id: editingCustomerId || customerModel.createId(),
    name: name,
    nic: nic,
    phone: phone,
    address: address
  };

  let isSaved;
  let isUpdated;

  if (editingCustomerId) {
    isUpdated = customerModel.update(editingCustomerId, customerData);

    if (isUpdated) {  
      alert("Customer updated successfully!");
    } else {
      alert("Error updating customer!");
    }

  } else {
    isSaved = customerModel.save(customerData);

    if (isSaved) {
      alert("Customer added successfully!");
    }else {
      alert("Error saving customer!");
    }
  }

  hideModal();
  resetCustomerForm();
  renderCustomers();
}

// Search Customers
function searchCustomers() {
  const term = document.getElementById('customerSearch').value.toLowerCase();
  document.querySelectorAll('#customersTableBody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
  });

}

// Reset Form
function resetCustomerForm() {
  document.getElementById('cusID').value = editingCustomerId || customerModel.createId();
  document.getElementById('cusName').value = '';
  document.getElementById('cusNIC').value = '';
  document.getElementById('cusPhone').value = '';
  document.getElementById('cusAddress').value = '';
}

// Show Add Customer Modal
function showAddCustomerModal() {
  editingCustomerId = null;
  document.getElementById('addCustomerModal').classList.remove('hidden');
  document.querySelector('#addCustomerModal .modal-content h2').textContent = 'Add Customer';
  resetCustomerForm();
}

// Hide Modal
function hideModal() {
  document.getElementById('addCustomerModal').classList.add('hidden');
  document.getElementById('showCustomerModal').classList.add('hidden');
  editingCustomerId = null;
}


// assigns them as properties on the window object
window.showAddCustomerModal = showAddCustomerModal;
window.resetCustomerForm = resetCustomerForm;
window.hideModal = hideModal;
window.saveCustomer = saveCustomer;
window.searchCustomers = searchCustomers;
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;