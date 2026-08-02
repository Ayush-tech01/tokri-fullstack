const express = require('express');
const {
  listOffers,
  adminListOffers,
  createOffer,
  updateOffer,
  deleteOffer
} = require('../controllers/offerController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

router.get('/', listOffers);
router.get('/admin/all', protect, adminOnly, adminListOffers);
router.post('/', protect, adminOnly, createOffer);
router.put('/:id', protect, adminOnly, updateOffer);
router.delete('/:id', protect, adminOnly, deleteOffer);

module.exports = router;
