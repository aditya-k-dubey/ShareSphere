const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

/**
 * POST /api/donations
 * Create a new donation.
 *
 * Body: { title, category, quantity, urgency, lat, lng }
 * The lat/lng are converted to GeoJSON Point format internally.
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, category, quantity, urgency, lat, lng } = req.body;

    // Validate presence of coordinates
    if (lat == null || lng == null) {
      return res.status(400).json({
        success: false,
        error: 'lat and lng are required',
      });
    }

    const donation = await Donation.create({
      title,
      category,
      quantity,
      urgency,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)], // GeoJSON: [lng, lat]
      },
    });

    res.status(201).json({ success: true, data: donation });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/donations
 * Fetch all donations.
 *
 * Optional query params:
 *   ?lat=<number>&lng=<number>  → sort results by nearest to that point
 *   ?category=<string>         → filter by category
 *   ?maxDistance=<meters>       → limit results within a radius (default: no limit)
 *
 * When lat/lng are provided, each returned document includes a `distance`
 * field (in metres) computed by MongoDB's $geoNear aggregation stage.
 */
router.get('/', async (req, res, next) => {
  try {
    const { lat, lng, category, maxDistance } = req.query;

    // ── If coordinates supplied → use $geoNear for distance-sorted results ──
    if (lat && lng) {
      const pipeline = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'distance', // metres from the query point
            spherical: true,
            ...(maxDistance ? { maxDistance: parseFloat(maxDistance) } : {}),
          },
        },
      ];

      // Optional category filter after $geoNear
      if (category) {
        pipeline.push({ $match: { category } });
      }

      // Sort nearest first (already default from $geoNear, but explicit)
      pipeline.push({ $sort: { distance: 1 } });

      const donations = await Donation.aggregate(pipeline);
      return res.json({ success: true, count: donations.length, data: donations });
    }

    // ── No coordinates → simple find, optionally filtered ───────────────────
    const filter = {};
    if (category) filter.category = category;

    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/donations/:id
 * Remove a donation by its ID.
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
