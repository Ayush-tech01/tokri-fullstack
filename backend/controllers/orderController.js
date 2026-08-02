const { nanoid } = require('nanoid');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const User = require('../models/User');
const { getOrCreateCart, summarize } = require('./cartController');

const PAYMENT_METHODS = ['COD', 'Card', 'UPI', 'Wallet', 'NetBanking'];

// Simulated payment gateway — DFD 5.3 "Process Payment" talks to an external Payment Gateway.
// There's no real processor here, so this stands in for one, deterministically
// (only fails when the caller explicitly asks it to, so the "Payment Failed / Try
// Again" branch in the flowchart can be demoed on purpose rather than at random).
function callPaymentGateway({ method, amount, simulateFailure }) {
  if (method === 'COD') {
    return { success: true, settled: false, transactionId: null }; // paid on delivery
  }
  if (simulateFailure) {
    return { success: false, settled: false, transactionId: null };
  }
  return { success: true, settled: true, transactionId: `PG-${nanoid(10).toUpperCase()}` };
}

async function attemptPayment(order, payment, { method, simulateFailure }) {
  const result = callPaymentGateway({ method, amount: order.totalAmount, simulateFailure });

  payment.method = method;
  order.paymentMethod = method;

  if (result.success) {
    payment.status = result.settled ? 'Success' : 'Pending';
    payment.transactionId = result.transactionId;
    payment.paidAt = result.settled ? new Date() : null;

    order.paymentStatus = result.settled ? 'Paid' : 'Pending';
    order.orderStatus = 'Confirmed';
  } else {
    payment.status = 'Failed';
    order.paymentStatus = 'Failed';
    order.orderStatus = 'Pending';
  }

  await payment.save();
  await order.save();
  return result.success;
}

// POST /api/orders/checkout
// body: { deliveryDetails: { fullName, phone, address, pincode }, paymentMethod, simulateFailure? }
// Implements DFD Level 2.4 (4.1 Enter Delivery Details -> 4.2 Select Payment Method
// -> 4.3 Process Payment -> 4.4 Place Order) end to end in one call.
async function checkout(req, res, next) {
  try {
    const { deliveryDetails, paymentMethod, simulateFailure } = req.body;

    if (!deliveryDetails || !deliveryDetails.fullName || !deliveryDetails.phone ||
        !deliveryDetails.address || !deliveryDetails.pincode) {
      return res.status(400).json({ message: 'Full name, phone, address and pincode are required' });
    }
    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Select a valid payment method' });
    }

    const cart = await (await getOrCreateCart(req.user._id)).populate('items.product');
    if (!cart.items.length) {
      return res.status(400).json({ message: 'Your thela is empty' });
    }

    for (const item of cart.items) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.product ? item.product.name : 'An item'} doesn't have enough stock left`
        });
      }
    }

    const { itemsTotal, deliveryFee, totalAmount } = summarize(cart);

    const order = await Order.create({
      orderNumber: `TOK-${nanoid(6).toUpperCase()}`,
      customer: req.user._id,
      items: cart.items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        unit: i.product.unit,
        unitPrice: i.priceAtAdd,
        quantity: i.quantity,
        subtotal: i.priceAtAdd * i.quantity
      })),
      itemsTotal,
      deliveryFee,
      totalAmount,
      deliveryDetails,
      paymentMethod
    });

    const delivery = await Delivery.create({
      order: order._id,
      address: deliveryDetails.address,
      deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // same-day-next-day estimate
    });

    const payment = await Payment.create({
      order: order._id,
      customer: req.user._id,
      method: paymentMethod,
      amount: totalAmount
    });

    const paid = await attemptPayment(order, payment, { method: paymentMethod, simulateFailure });

    if (!paid) {
      return res.status(402).json({
        message: 'Payment failed — you can try again',
        order,
        payment
      });
    }

    // Payment (or COD confirmation) went through — decrement stock and empty the cart
    await Promise.all(
      cart.items.map(i => Product.findByIdAndUpdate(i.product._id, { $inc: { stock: -i.quantity } }))
    );
    cart.items = [];
    await cart.save();

    res.status(201).json({ order, delivery, payment });
  } catch (err) {
    next(err);
  }
}

// POST /api/orders/:id/retry-payment — "Payment Failed, Try Again" loop in the flowchart
async function retryPayment(req, res, next) {
  try {
    const { paymentMethod, simulateFailure } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your order' });
    }
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'This order is already paid' });
    }

    const payment = await Payment.findOne({ order: order._id });
    const method = paymentMethod || order.paymentMethod;
    const paid = await attemptPayment(order, payment, { method, simulateFailure });

    if (!paid) {
      return res.status(402).json({ message: 'Payment failed again — you can retry', order, payment });
    }

    const delivery = await Delivery.findOne({ order: order._id });
    res.json({ order, delivery, payment });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders — logged-in customer's own order history
async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id — single order with delivery + payment (used for confirmation/invoice)
async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name icon');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.customer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    const [delivery, payment] = await Promise.all([
      Delivery.findOne({ order: order._id }),
      Payment.findOne({ order: order._id })
    ]);

    res.json({ order, delivery, payment });
  } catch (err) {
    next(err);
  }
}

// ---------- Admin ----------

// GET /api/orders/admin/all
async function adminListOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/orders/:id/status (admin) — body: { orderStatus, deliveryStatus }
async function adminUpdateStatus(req, res, next) {
  try {
    const { orderStatus, deliveryStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    await order.save();

    let delivery = await Delivery.findOne({ order: order._id });
    if (delivery && deliveryStatus) {
      delivery.deliveryStatus = deliveryStatus;
      await delivery.save();
    }

    res.json({ order, delivery });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/reports/sales
async function salesReport(req, res, next) {
  try {
    const [summary] = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const byStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      summary: summary || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
      byStatus,
      topProducts
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/reports/inventory
async function inventoryReport(req, res, next) {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ stock: 1 })
      .select('name brand stock category isActive');
    const lowStock = products.filter(p => p.stock <= 10);
    res.json({ products, lowStock });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/customers
async function listCustomers(req, res, next) {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('name email phone address registrationDate')
      .sort({ registrationDate: -1 });
    res.json({ customers });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/reports/recent-orders?minutes=60
async function recentOrders(req, res, next) {
  try {
    const minutes = Number(req.query.minutes) || 60;
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const orders = await Order.find({ createdAt: { $gte: since } })
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ minutes, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkout,
  retryPayment,
  myOrders,
  getOrder,
  adminListOrders,
  adminUpdateStatus,
  salesReport,
  inventoryReport,
  listCustomers,
  recentOrders
};
