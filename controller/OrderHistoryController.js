import { OrderModel } from '../model/OrderModel.js';
import { OrderDetailsModel } from '../model/OrderDetailsModel.js';
import {ItemModel} from '../model/ItemModel.js';
import { CustomerModel } from '../model/CustomerModel.js';

const customerModel = new CustomerModel();
const itemModel = new ItemModel();
const orderDetailsModel = new OrderDetailsModel();
const orderModel = new OrderModel();

export function renderOrderHistory() {
  const orderHistoryTable = document.getElementById('orderHistoryTableBody');
  orderHistoryTable.innerHTML = '';

  if (orderModel.getAll().length === 0) {
    orderHistoryTable.innerHTML = '<tr><td colspan="5" style="text-align:center;">No orders placed yet.</td></tr>';
    return;
  }

  orderModel.getAll().forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.date}</td>
      <td>${customerModel.getById(order.customerId)?.name || 'Unknown Customer'}</td>
      <td>${itemModel.getBySKU(orderDetailsModel.getByOrderId(order.id)[0]?.sku)?.name || 'No details available'}</td>
      <td>${orderDetailsModel.getByOrderId(order.id)[0]?.qty || 'No details available'}</td>
      <td>$${order.total.toFixed(2)}</td>      
      <td class="actions">
        <button onclick="viewProduct('${order.id}')" class="action-btn view" title="View">👁</button>
      </td>
    `;
    orderHistoryTable.appendChild(row);
  }); 
}