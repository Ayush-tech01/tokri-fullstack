const express = require('express');
const {
  checkout,
  retryPayment,
  myOrders,
  getOrder,
  adminListOrders,
  adminUpdateStatus
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.use(protect); // every order route requires a logged-in user

// Specific routes first so they don't get swallowed by /:id
router.get('/admin/all', adminOnly, adminListOrders);

router.post('/checkout', checkout);
router.get('/', myOrders);
router.get('/:id', getOrder);
router.post('/:id/retry-payment', retryPayment);
router.patch('/:id/status', adminOnly, adminUpdateStatus);

module.exports = router;
