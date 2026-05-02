import { OrderModel } from '../model/OrderModel.js';
import { OrderDetailsModel } from '../model/OrderDetailsModel.js';
import { ItemModel} from '../model/ItemModel.js';
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

    const allOrders = orderModel.getAll();

    allOrders.forEach(order => {
    const orderDetails = orderDetailsModel.getByOrderId(order.id);
    const customer = customerModel.getById(order.customerId);
    const itemCount = orderDetails.length || 1;

    orderDetails.forEach((detail, index) => {
      const item = itemModel.getBySKU(detail.sku);
      const row = document.createElement('tr');

      if (index === 0) {
        row.innerHTML = `
          <td rowspan="${itemCount}">${order.id}</td>
          <td rowspan="${itemCount}">${order.date}</td>
          <td rowspan="${itemCount}">${customer?.name || 'Unknown Customer'}</td>
          <td>${item?.name || 'Unknown Item'}</td>
          <td>${detail.qty}</td>
          <td rowspan="${itemCount}">$${order.total.toFixed(2)}</td>
        `;
      } else {
        row.innerHTML = `
          <td>${item?.name || 'Unknown Item'}</td>
          <td>${detail.qty}</td>
        `;
      }

      orderHistoryTable.appendChild(row);
    });
  }); 
}