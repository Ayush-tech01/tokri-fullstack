const express = require('express');
const { viewCart, addItem, updateItem, removeItem, clearCart } = require('../controllers/cartController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every cart route requires a logged-in customer

router.get('/', viewCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);
router.delete('/', clearCart);

module.exports = router;
