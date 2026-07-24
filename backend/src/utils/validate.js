import { validationResult } from "express-validator";

/**
 * Middleware that returns a 400 with a clean error list if any
 * express-validator checks failed on the request.
 */
export function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
