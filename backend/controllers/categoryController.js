const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /api/categories
async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

// POST /api/categories (admin)
async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

// PUT /api/categories/:id (admin)
async function updateCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/categories/:id (admin)
async function deleteCategory(req, res, next) {
  try {
    const inUse = await Product.countDocuments({ category: req.params.id });
    if (inUse > 0) {
      return res.status(400).json({ message: `${inUse} product(s) still use this category` });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
