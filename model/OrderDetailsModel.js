import { ordersDetails } from "../db/DB.js";

export class OrderDetailsModel {
  save(orderDetailData) {
    let len =  ordersDetails.length;
    ordersDetails.push(orderDetailData);

    if (ordersDetails.length > len) {
      return true;
    }
    return false;    
  }

  getByOrderId(orderId) {
    return ordersDetails.filter(od => od.orderId === orderId);
  }
}