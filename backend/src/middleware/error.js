/** 404 handler for unmatched routes. */
export function notFound(req, res) {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/** Central error handler. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error("API error:", err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ ok: false, message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ ok: false, message: "Invalid identifier." });
  }

  res.status(err.status || 500).json({
    ok: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error." : err.message,
  });
}
