import { customers } from '../db/DB.js';

export class CustomerModel {
   getAll() {
    if (customers.length === 0) {

    }else {
        return customers;
    }

  }

  getById(id) {
    return customers.find(c => c.id === id);
  }

  save(customerData) {
    const newCustomer = { ...customerData, id: "CU" + String(customers.length + 1).padStart(3, '0') };
    customers.push(newCustomer);
    return newCustomer;
  }

  update(id, customerData) {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...customerData };
      return customers[index];
    }
    return null;
  }

  delete(id) {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers.splice(index, 1);
      return true;
    }
    return false;
  }
}