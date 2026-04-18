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
    let len =  customers.length;
    customers.push(customerData);

    if (customers.length > len) {
      return true;
    }
    return false;
    
  }

  update(id, customerData) {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...customerData };
      return true;
    }
    return false;
  }

  delete(id) {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers.splice(index, 1);
      return true;
    }
    return false;
  }

  createId() {
    return "CU" + String(customers.length + 1).padStart(3, '0');
  }
}