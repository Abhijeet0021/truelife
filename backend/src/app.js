import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import contactRoutes from "./routes/contact.js";
import volunteerRoutes from "./routes/volunteer.js";
import donationRoutes from "./routes/donation.js";
import adminRoutes from "./routes/admin.js";
import galleryRoutes from "./routes/gallery.js";
import { GALLERY_DIR } from "./config/upload.js";
import { notFound, errorHandler } from "./middleware/error.js";

/**
 * Builds the Express app. Separated from server startup so it can be
 * imported directly in tests without opening a port.
 */
export function createApp() {
  const app = express();

  app.set("trust proxy", 1); // correct req.ip behind a proxy/host

  // CORS — allow configured origin(s). In development, also allow any
  // localhost / 127.0.0.1 origin so the Vite port doesn't matter.
  const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());
  const isDev = process.env.NODE_ENV !== "production";

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true); // curl / same-origin / server-to-server
        if (origins.includes(origin)) return cb(null, true);
        if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return cb(null, true);
        }
        return cb(new Error(`Not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));

  // Rate limit public write endpoints to blunt spam/abuse
  const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, message: "Too many requests, please try again later." },
  });

  app.get("/api/health", (req, res) => res.json({ ok: true, uptime: process.uptime() }));

  // Publicly serve uploaded gallery images (only this subfolder, not CVs).
  app.use("/uploads/gallery", express.static(GALLERY_DIR));

  app.use("/api/contact", publicLimiter, contactRoutes);
  app.use("/api/volunteers", publicLimiter, volunteerRoutes);
  app.use("/api/donations", donationRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
