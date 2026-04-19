import { products } from "../db/DB.js";

export class ItemModel {
  getAll() {
    if (products.length === 0) {
        alert("No products found!");
        return[];
    }else {
        return products;
    }
  }

  getBySKU(sku) {
    return products.find(p => p.sku === sku);
  }

  save(productData) {
    let len = products.length;
    products.push(productData);

    if (products.length > len) {
      return true;
    }
    return false;    
  }

  update(sku, productData) {
    const index = products.findIndex(p => p.sku === sku);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      return true;
    }
    return false;
  }

  delete(sku) {
    const index = products.findIndex(p => p.sku === sku);
    if (index !== -1) {
      products.splice(index, 1);
      return true;
    }
    return false;
  }

  createSKU() {
    return "PT" + String(100 + products.length).padStart(3, '0');
  }
}