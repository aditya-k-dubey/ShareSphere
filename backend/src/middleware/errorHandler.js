/**
 * Centralized error handler middleware.
 * Catches any error thrown (or passed via next(err)) in routes.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  // Mongoose CastError (e.g., bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: `Invalid ${err.path}: ${err.value}` });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, error: `Duplicate value for field: ${field}` });
  }

  // Default 500
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
