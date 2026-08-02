const Cart = require('../models/Cart');
const Product = require('../models/Product');

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 30;

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function summarize(cart) {
  const itemsTotal = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
  const deliveryFee = itemsTotal === 0 || itemsTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return {
    items: cart.items,
    itemsTotal,
    deliveryFee,
    totalAmount: itemsTotal + deliveryFee,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD
  };
}

// GET /api/cart — 3.4 View Cart Details
async function viewCart(req, res, next) {
  try {
    const cart = await (await getOrCreateCart(req.user._id)).populate('items.product');
    res.json(summarize(cart));
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/items  { productId, quantity } — 3.1 Add Item to Cart
async function addItem(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find(i => i.product.toString() === productId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), priceAtAdd: product.price });
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(201).json(summarize(cart));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/cart/items/:productId  { quantity } — 3.2 Update Quantity
async function updateItem(req, res, next) {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate('items.product');
    res.json(summarize(cart));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/items/:productId — 3.3 Remove Item
async function removeItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.json(summarize(cart));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart — clear (used after checkout)
async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(summarize(cart));
  } catch (err) {
    next(err);
  }
}

module.exports = { viewCart, addItem, updateItem, removeItem, clearCart, getOrCreateCart, summarize };
