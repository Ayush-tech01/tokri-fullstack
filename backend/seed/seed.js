require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Payment = require('../models/Payment');

const categories = [
  { key: 'fruits-veg',   name: 'Fruits & Vegetables', icon: '🥬', stamp: 'FARM FRESH', themeColor: 'spinach' },
  { key: 'dairy',        name: 'Dairy Products',      icon: '🥛', stamp: 'CHILLED',    themeColor: 'turmeric' },
  { key: 'snacks',       name: 'Snacks',               icon: '🥨', stamp: 'CRUNCHY',    themeColor: 'turmericDeep' },
  { key: 'beverages',    name: 'Beverages',            icon: '🧃', stamp: 'CHILLED',    themeColor: 'brinjal' },
  { key: 'household',    name: 'Household Items',      icon: '🧺', stamp: 'HANDY',      themeColor: 'slate' },
  { key: 'meat-seafood', name: 'Meat & Seafood',       icon: '🍗', stamp: 'ON ICE',     themeColor: 'tomato' }
];

// [name, brand, categoryKey, price, mrp, unit, veg, icon, rating, stock, description]
const products = [
  ['Desi Tomatoes', 'Punjab Farms', 'fruits-veg', 34, null, '1 kg', true, '🍅', 4.4, 24, 'Vine-ripened, thin-skinned tomatoes picked at dawn from Khanna. Best for curries and chutney.'],
  ['Palak (Spinach)', 'Punjab Farms', 'fruits-veg', 22, 26, '1 bunch', true, '🥬', 4.2, 18, 'Tender spinach leaves, washed and trimmed. Great for saag and dals.'],
  ['Robusta Bananas', 'Local Basket', 'fruits-veg', 49, null, '1 dozen', true, '🍌', 4.5, 30, 'Naturally ripened bananas, no carbide. Sweet and firm.'],
  ['Shimla Apples', 'Local Basket', 'fruits-veg', 180, 210, '1 kg', true, '🍎', 4.6, 15, 'Crisp, hand-picked apples from the Shimla hills. Great crunch, low bruising.'],
  ['Onions', 'Punjab Farms', 'fruits-veg', 28, null, '1 kg', true, '🧅', 4.1, 40, 'Everyday cooking onions, medium size, dry-cured for a longer shelf life.'],
  ['Potatoes', 'Punjab Farms', 'fruits-veg', 24, null, '1 kg', true, '🥔', 4.0, 45, 'All-purpose potatoes, good for both curries and fries.'],

  ['Toned Milk', 'Verka', 'dairy', 58, null, '1 L', true, '🥛', 4.5, 22, 'Fresh toned milk, delivered chilled. Pasteurised the same morning.'],
  ['Malai Paneer', 'Verka', 'dairy', 90, 100, '200 g', true, '🧀', 4.6, 16, 'Soft, creamy paneer cubes made in-house daily. No preservatives.'],
  ['Fresh Curd', 'Local Dairy', 'dairy', 45, null, '400 g', true, '🥣', 4.3, 20, 'Thick, set curd — mildly tangy, made the traditional way.'],
  ['Farm Eggs', 'Local Dairy', 'dairy', 54, 60, '6 pcs', false, '🥚', 4.4, 26, 'Free-range eggs, collected fresh daily, no cold storage delay.'],
  ['Salted Butter', 'Verka', 'dairy', 52, null, '100 g', true, '🧈', 4.5, 19, 'Churned butter with a light salt finish, great on hot parathas.'],

  ['Aloo Bhujia', "Haldiram's", 'snacks', 45, null, '200 g', true, '🥔', 4.3, 34, 'Crisp, spiced potato noodles — the classic teatime bhujia.'],
  ['Classic Salted Chips', "Lay's", 'snacks', 20, null, '52 g', true, '🍟', 4.2, 50, 'Thin-cut, evenly salted potato chips.'],
  ['Roasted Namkeen Mix', 'Bikaji', 'snacks', 60, 68, '250 g', true, '🥜', 4.4, 21, 'A crunchy mix of roasted lentils, peanuts and sev.'],
  ['Digestive Biscuits', "Haldiram's", 'snacks', 35, null, '200 g', true, '🍪', 4.1, 28, 'Wheat-forward, lightly sweet biscuits — good with chai.'],

  ['Masala Chai Leaves', 'Tata', 'beverages', 120, null, '250 g', true, '🍵', 4.5, 24, 'Strong Assam blend with a natural spice edge, brews a deep cup.'],
  ['Orange Juice', 'Real', 'beverages', 110, 125, '1 L', true, '🧃', 4.2, 17, 'No added sugar, made from real orange concentrate.'],
  ['Cola', 'Coca-Cola', 'beverages', 40, null, '750 ml', true, '🥤', 4.0, 38, 'Classic chilled cola, straight from the crate.'],
  ['Filter Coffee Powder', 'Tata', 'beverages', 150, null, '200 g', true, '☕', 4.6, 14, 'A South Indian style chicory blend, roasted fresh.'],

  ['Dishwash Liquid', 'Vim', 'household', 99, null, '500 ml', true, '🧴', 4.3, 22, 'Cuts grease fast, gentle enough for daily hand-wash.'],
  ['Detergent Powder', 'Surf Excel', 'household', 135, 150, '1 kg', true, '🧼', 4.4, 19, 'Deep-clean detergent for both machine and hand wash.'],
  ['Toilet Cleaner', 'Harpic', 'household', 85, null, '500 ml', true, '🧽', 4.2, 20, 'Removes stains and odour, kills 99.9% of germs.'],
  ['Garbage Bags', 'Vim', 'household', 99, null, '30 pcs', true, '🗑️', 4.0, 30, 'Leak-resistant medium bags, fits most kitchen bins.'],

  ['Chicken Breast', 'Licious', 'meat-seafood', 220, 240, '500 g', false, '🍗', 4.5, 12, 'Antibiotic-free, cleaned and cut, chilled — never frozen.'],
  ['Rohu Fish Fillet', 'Licious', 'meat-seafood', 210, null, '500 g', false, '🐟', 4.3, 10, 'Deboned rohu fillets, cleaned and ready to cook.']
];

const offers = [
  { eyebrow: 'FLAT DISCOUNT', title: '20% off your first thela', description: "Use code PEHLA20 on orders above ₹399. New customers only.", code: 'PEHLA20', discountType: 'percentage', discountValue: 20, theme: 'spinach' },
  { eyebrow: 'FESTIVAL STOCK', title: 'Rakhi hamper combos from ₹299', description: 'Sweets, dry fruits & snacks bundled and packed same-day.', code: null, discountType: 'combo', discountValue: 0, theme: 'turmeric' },
  { eyebrow: 'COMBO DEAL', title: 'Buy 2 get 1 free — all snacks', description: "Mix and match Haldiram's, Lay's and Bikaji packs. Cheapest one's free.", code: null, discountType: 'combo', discountValue: 0, theme: 'tomato' }
];

async function seed() {
  await connectDB();

  const destroy = process.argv.includes('--destroy');

  console.log('Clearing existing data...');
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Offer.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Delivery.deleteMany({}),
    Payment.deleteMany({}),
    User.deleteMany({})
  ]);

  if (destroy) {
    console.log('Database cleared. Skipping re-seed (--destroy flag set).');
    await mongoose.disconnect();
    return;
  }

  console.log('Inserting categories...');
  const createdCategories = await Category.insertMany(categories);
  const categoryIdByKey = Object.fromEntries(createdCategories.map(c => [c.key, c._id]));

  console.log('Inserting products...');
  await Product.insertMany(
    products.map(([name, brand, catKey, price, mrp, unit, veg, icon, rating, stock, description]) => ({
      name, brand, category: categoryIdByKey[catKey], price, mrp, unit, veg, icon, rating, stock, description
    }))
  );

  console.log('Inserting offers...');
  await Offer.insertMany(offers);

  console.log('Creating demo accounts...');
  await User.create({
    name: 'Admin',
    email: 'admin@tokri.in',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin',
    address: 'tokri. HQ, Ferozepur Road, Ludhiana'
  });
  await User.create({
    name: 'Customer',
    email: 'customer@tokri.in',
    phone: '9876543210',
    password: 'customer123',
    role: 'customer',
    address: 'Sector 17, Chandigarh'
  });

  console.log('Seed complete.');
  console.log('  Admin login:    admin@tokri.in / admin123');
  console.log('  Customer login: customer@tokri.in / customer123');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
