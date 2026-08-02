const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, phone, password, address });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getProfile(req, res, next) {
  try {
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/me
async function updateProfile(req, res, next) {
  try {
    const { name, phone, address } = req.body;
    if (name) req.user.name = name;
    if (phone) req.user.phone = phone;
    if (address !== undefined) req.user.address = address;
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, updateProfile };
