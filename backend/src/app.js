const express = require('express');
const cors = require('cors');
const donationRoutes = require('./routes/donations');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Global middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/donations', donationRoutes);

// ── Error handler (must be last) ────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
