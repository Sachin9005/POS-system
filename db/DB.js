export let customers = [
  { id: "CU001", name: "Kasun Perera", nic: "12498345785", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" },
  { id: "CU002", name: "Nimali Silva", nic: "13178964582", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" },
  { id: "CU003", name: "Ruwan Fernando", nic: "12796183487", address: "72,Galle Road, Galle", phone: "+94 71 589 6314" }
];

export let products = [
  { sku: "PT001", name: "Lenovo IdeaPad 3", category: "Computers", stock: 100, price: 500},
  { sku: "PT002", name: "Beats Pro", category: "Electronics", stock: 140, price: 1500},
  { sku: "PT004", name: "Apple Series 5 Watch", category: "Electronics", stock: 450, price: 1000},
  { sku: "PT005", name: "Amazon Echo Dot", category: "Electronics", stock: 320, price: 1200},
  { sku: "PT008", name: "iPhone 14 Pro", category: "Phone", stock: 630, price: 100 }
];

export let orders = [
  { id: "ORD157979", date: "2024-06-01", customerId: "CU001", total: 1500 ,sub_total: 1450,discount: 50},
  { id: "ORD157980", date: "2024-06-02", customerId: "CU002", total: 1000 ,sub_total: 980,discount: 20},
  { id: "ORD157981", date: "2024-06-03", customerId: "CU003", total: 1200 ,sub_total: 1190,discount: 10}
];

export let ordersDetails = [
  { orderId: "ORD157979", sku: "PT002", qty: 1 ,amount: 1500},
  { orderId: "ORD157979", sku: "PT001", qty: 1, amount: 500},
  { orderId: "ORD157980", sku: "PT004", qty: 1, amount: 1000},
  { orderId: "ORD157981", sku: "PT005", qty: 1, amount: 1200}
];

export let user = { username: "admin", password: "admin" };