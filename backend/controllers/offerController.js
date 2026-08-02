const Offer = require('../models/Offer');

// GET /api/offers — active offers, for the public offer board
async function listOffers(req, res, next) {
  try {
    const offers = await Offer.find({ active: true }).sort({ createdAt: -1 });
    res.json({ offers });
  } catch (err) {
    next(err);
  }
}

// GET /api/offers/admin/all — every offer, active or not (admin)
async function adminListOffers(req, res, next) {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ offers });
  } catch (err) {
    next(err);
  }
}

// POST /api/offers (admin)
async function createOffer(req, res, next) {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ offer });
  } catch (err) {
    next(err);
  }
}

// PUT /api/offers/:id (admin)
async function updateOffer(req, res, next) {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ offer });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/offers/:id (admin)
async function deleteOffer(req, res, next) {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listOffers, adminListOffers, createOffer, updateOffer, deleteOffer };
