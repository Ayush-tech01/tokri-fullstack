const express = require('express');
const { salesReport, inventoryReport, listCustomers, recentOrders } = require('../controllers/orderController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/reports/sales', salesReport);
router.get('/reports/inventory', inventoryReport);
router.get('/reports/recent-orders', recentOrders);
router.get('/customers', listCustomers);

module.exports = router;
