const mongoose = require('mongoose');

/**
 * Donation Schema
 * Uses GeoJSON Point for location with a 2dsphere index
 * enabling MongoDB's native geospatial queries.
 */
const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['food', 'clothes', 'books', 'electronics', 'furniture', 'medicine', 'toys', 'other'],
        message: 'Invalid category: {VALUE}',
      },
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },

    urgency: {
      type: String,
      required: [true, 'Urgency is required'],
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Urgency must be low, medium, or high',
      },
      default: 'low',
    },

    /**
     * GeoJSON Point: coordinates stored as [longitude, latitude]
     * (Note: MongoDB uses [lng, lat] order — opposite of Leaflet's [lat, lng])
     */
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Location coordinates are required'],
        validate: {
          validator: (coords) =>
            coords.length === 2 &&
            coords[0] >= -180 && coords[0] <= 180 && // longitude
            coords[1] >= -90  && coords[1] <= 90,    // latitude
          message: 'Invalid coordinates. Must be [longitude, latitude].',
        },
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Geospatial index ────────────────────────────────────────────────────────
// Required for $near / $geoNear queries
donationSchema.index({ location: '2dsphere' });

// ── Virtual: expose lat/lng as a convenience ────────────────────────────────
donationSchema.virtual('lat').get(function () {
  return this.location.coordinates[1];
});
donationSchema.virtual('lng').get(function () {
  return this.location.coordinates[0];
});

module.exports = mongoose.model('Donation', donationSchema);
