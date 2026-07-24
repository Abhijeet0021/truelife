import { Router } from "express";
import path from "path";
import fs from "fs";
import GalleryItem from "../models/GalleryItem.js";
import { requireAdmin } from "../middleware/auth.js";
import { uploadGalleryImage, GALLERY_DIR } from "../config/upload.js";

const router = Router();

const CATEGORIES = new Set(["education", "health", "welfare", "general"]);

/**
 * GET /api/gallery?category=education
 * Public — list gallery items (optionally filtered by programme), newest first.
 */
router.get("/", async (req, res, next) => {
  try {
    const filter = CATEGORIES.has(req.query.category) ? { category: req.query.category } : {};
    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, items });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/gallery  (admin)
 * Add a video by URL:   JSON  { type: "video", title, caption, videoUrl }
 * Add a photo:          multipart/form-data with field "image" + title, caption
 */
router.post("/", requireAdmin, (req, res, next) => {
  uploadGalleryImage(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    try {
      const { title = "", caption = "", videoUrl = "", type } = req.body;
      const category = CATEGORIES.has(req.body.category) ? req.body.category : "general";

      // Video item (YouTube / Vimeo link)
      if (type === "video" || (!req.file && videoUrl)) {
        if (!videoUrl) return res.status(400).json({ ok: false, message: "A video URL is required." });
        const item = await GalleryItem.create({ type: "video", category, title, caption, videoUrl });
        return res.status(201).json({ ok: true, item });
      }

      // Photo item (uploaded file)
      if (!req.file) return res.status(400).json({ ok: false, message: "An image file or video URL is required." });
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/gallery/${req.file.filename}`;
      const item = await GalleryItem.create({
        type: "photo",
        category,
        title,
        caption,
        imageUrl,
        imageFile: req.file.filename,
      });
      res.status(201).json({ ok: true, item });
    } catch (e) {
      next(e);
    }
  });
});

/**
 * DELETE /api/gallery/:id  (admin)
 * Remove an item (and its image file, if any).
 */
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ ok: false, message: "Not found." });

    if (item.imageFile) {
      const filePath = path.join(GALLERY_DIR, item.imageFile);
      fs.promises.unlink(filePath).catch(() => {}); // ignore if already gone
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
