import { renderCustomerSelect } from './PlaceOrderController.js';
import { renderProducts } from './itemController.js';
import { renderCustomers } from './customersController.js';

 // ==================== NAVIGATION ====================
    function navigate(page) {
      document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
      document.querySelectorAll('.sidebar ul li').forEach(item => item.classList.remove('active'));

      const section = document.getElementById(page + 'Section');
      if (section) section.classList.remove('hidden');

      document.querySelector(`[data-page="${page}"]`).classList.add('active');

      if (page === 'place-order') renderCustomerSelect();
      if (page === 'products') renderProducts();
      if (page === 'customers') renderCustomers();
    }

    export function initSidebar() {
      document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.addEventListener('click', () => {
          navigate(item.getAttribute('data-page'));
        });
      });
    }