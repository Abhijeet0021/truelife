import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Files are stored in backend/uploads/ (created if missing, git-ignored).
export const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10);
    cb(null, `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${safeExt}`);
  },
});

// Single CV file, max 2 MB, PDF/DOC/DOCX only.
export const uploadCV = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true);
    cb(new Error("Only PDF or Word documents are allowed"));
  },
}).single("cv");

/* ─── Gallery images (public) ───
   Stored in a separate subfolder that IS served statically, so they can be
   shown on the public site. (CVs stay in the private uploads/ root.) */
export const GALLERY_DIR = path.resolve(UPLOAD_DIR, "gallery");
fs.mkdirSync(GALLERY_DIR, { recursive: true });

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, GALLERY_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10) || ".jpg";
    cb(null, `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${safeExt}`);
  },
});

// Single image, max 8 MB, common web image formats only.
export const uploadGalleryImage = multer({
  storage: galleryStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (IMAGE_TYPES.has(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
  },
}).single("image");
