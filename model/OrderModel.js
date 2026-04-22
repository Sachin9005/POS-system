import { orders } from "../db/DB.js";

export class OrderModel {
    save(orderData) {
        let len =  orders.length;
        orders.push(orderData);

        if (orders.length > len) {
          return true;
        }
        return false;    
      }
}     