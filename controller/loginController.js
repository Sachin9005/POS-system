import { initSidebar} from './sideBarController.js';
import { initChart,updateDate,updateDashboardStats} from './dashBoardController.js';   
import { renderProducts } from './itemController.js';
import { renderCustomers } from './customersController.js';
import { LoginModel } from '../model/LoginModel.js';
import { renderOrderHistory } from './OrderHistoryController.js';

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', (e) => {
      login();
});

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (LoginModel.authenticate(username, password)) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        initSidebar();
        initChart();
        updateDate();
        updateDashboardStats();
        renderCustomers();
        renderProducts();
        renderOrderHistory();
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

