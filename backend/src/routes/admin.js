import { Router } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import Admin from "../models/Admin.js";
import Contact from "../models/Contact.js";
import Volunteer from "../models/Volunteer.js";
import Donation from "../models/Donation.js";
import { requireAdmin } from "../middleware/auth.js";
import { handleValidation } from "../utils/validate.js";
import { UPLOAD_DIR } from "../config/upload.js";
import path from "path";
import fs from "fs";

const router = Router();

/**
 * POST /api/admin/login
 * Public — exchange email + password for a JWT.
 */
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  handleValidation,
  async (req, res, next) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email });
      if (!admin || !(await admin.verifyPassword(req.body.password))) {
        return res.status(401).json({ ok: false, message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { sub: admin._id.toString(), email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({ ok: true, token, admin: { email: admin.email, name: admin.name } });
    } catch (err) {
      next(err);
    }
  }
);

/* Everything below requires a valid admin token. */
router.use(requireAdmin);

// Helper: standard pagination params
function paging(req) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
  return { page, limit, skip: (page - 1) * limit };
}

/** GET /api/admin/stats — dashboard summary counts */
router.get("/stats", async (req, res, next) => {
  try {
    const [contacts, volunteers, donationsPaid, revenueAgg] = await Promise.all([
      Contact.countDocuments(),
      Volunteer.countDocuments(),
      Donation.countDocuments({ status: "paid" }),
      Donation.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      ok: true,
      stats: {
        contacts,
        volunteers,
        donationsPaid,
        totalRaisedInr: (revenueAgg[0]?.total || 0) / 100,
      },
    });
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/contacts */
router.get("/contacts", async (req, res, next) => {
  try {
    const { page, limit, skip } = paging(req);
    const [items, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);
    res.json({ ok: true, items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/volunteers */
router.get("/volunteers", async (req, res, next) => {
  try {
    const { page, limit, skip } = paging(req);
    const filter = req.query.status ? { status: req.query.status } : {};
    const [items, total] = await Promise.all([
      Volunteer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Volunteer.countDocuments(filter),
    ]);
    res.json({ ok: true, items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/admin/volunteers/:id — update application status */
router.patch("/volunteers/:id", async (req, res, next) => {
  try {
    const doc = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!doc) return res.status(404).json({ ok: false, message: "Not found." });
    res.json({ ok: true, item: doc });
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/volunteers/:id/cv — download an applicant's CV */
router.get("/volunteers/:id/cv", async (req, res, next) => {
  try {
    const doc = await Volunteer.findById(req.params.id);
    if (!doc || !doc.cvFile) return res.status(404).json({ ok: false, message: "No CV on file." });

    const filePath = path.join(UPLOAD_DIR, doc.cvFile);
    if (!fs.existsSync(filePath)) return res.status(404).json({ ok: false, message: "File missing." });

    res.download(filePath, doc.cvName || doc.cvFile);
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/donations */
router.get("/donations", async (req, res, next) => {
  try {
    const { page, limit, skip } = paging(req);
    const filter = req.query.status ? { status: req.query.status } : {};
    const [items, total] = await Promise.all([
      Donation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donation.countDocuments(filter),
    ]);
    res.json({ ok: true, items, total, page, limit });
  } catch (err) {
    next(err);
  }
});

export default router;
