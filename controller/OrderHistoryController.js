import{orders} from '../db/DB.js';

export function renderOrderHistory() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderHistoryTable = document.getElementById('orderHistoryTableBody');
  orderHistoryTable.innerHTML = '';

  if (orders.length === 0) {
    orderHistoryTable.innerHTML = '<tr><td colspan="5" style="text-align:center;">No orders placed yet.</td></tr>';
    return;
  }

  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${new Date(order.date).toLocaleString()}</td>
      <td>${order.customerId}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td>${order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
      <td class="actions">
        <button onclick="viewProduct('${order.id}')" class="action-btn view" title="View">👁</button>
      </td>
    `;
    orderHistoryTable.appendChild(row);
  });
}