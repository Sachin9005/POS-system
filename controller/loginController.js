import { initSidebar} from './sideBarController.js';
import { initChart,updateDate} from './dashBoardController.js';   
import { renderProducts } from './itemController.js';
import { renderCustomers } from './customersController.js';

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', (e) => {
      login();
});

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        initSidebar();
        initChart();
        updateDate();
        renderCustomers();
        renderProducts();
        alert("Login successful! Welcome, admin.");
    } else {
        alert("Invalid credentials! Please try again.");
        return;
    }
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
      logout();
});

function logout() {
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert("You have been logged out.");
}

