 import { products,orders,ordersDetails } from '../db/DB.js';
    
    
    // CHART
    let overviewChart;
    export function initChart() {
      const ctx = document.getElementById('stockChart').getContext('2d');
        const stockChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(p => p.name),
                datasets: [{
                    label: 'Stock Quantity',
                    data: products.map(p => p.stock),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // details update

    export function updateDashboardStats() {
      document.getElementById('savedProductsCount').textContent = products.length;
      document.getElementById('stockProductsCount').textContent = products.reduce((sum, p) => sum + p.stock, 0);
      document.getElementById('saleProductsCount').textContent = ordersDetails.reduce((sum, d) => sum + d.qty, 0);
      const averageRevenue = orders.length
        ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length
        : 0;
      document.getElementById('averageRevenueCount').textContent = averageRevenue.toFixed(2);
}

    // DATE
    export function updateDate() {
      const dateEl = document.getElementById('currentDate');
      dateEl.textContent = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    }