const Product = require('../models/Product');

// GET /api/products
// Query params: search, category, veg (all|veg|nonveg), maxPrice, brand (comma list), sort
async function listProducts(req, res, next) {
  try {
    const { search, category, veg, maxPrice, brand, sort } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    if (veg === 'veg') filter.veg = true;
    if (veg === 'nonveg') filter.veg = false;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (brand) filter.brand = { $in: brand.split(',') };

    let query = Product.find(filter).populate('category', 'key name themeColor');

    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });
    else if (sort === 'rating-desc') query = query.sort({ rating: -1 });
    else query = query.sort({ createdAt: 1 });

    const products = await query;
    res.json({ count: products.length, products });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/brands — distinct brand list, for the filter sidebar
async function listBrands(req, res, next) {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    res.json({ brands: brands.sort() });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'key name themeColor');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

// POST /api/products (admin)
async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  listBrands,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
