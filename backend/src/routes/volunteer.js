import { Router } from "express";
import { body } from "express-validator";
import Volunteer from "../models/Volunteer.js";
import { handleValidation } from "../utils/validate.js";
import { notifyAdmin, sendConfirmation } from "../utils/notify.js";
import { uploadCV } from "../config/upload.js";

const router = Router();

/**
 * POST /api/volunteers
 * Public — submit a volunteer application.
 * Field names match the payload built in the frontend VolunteerPage.
 */
router.post(
  "/",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("phone").trim().matches(/^[6-9]\d{9}$/).withMessage("Valid 10-digit Indian phone required"),
    body("skills").isArray({ min: 1 }).withMessage("Select at least one skill"),
    body("availability").isArray({ min: 1 }).withMessage("Select at least one day"),
    body("languages").isArray({ min: 1 }).withMessage("Select at least one language"),
    body("motivation").trim().isLength({ min: 30 }).withMessage("Motivation must be at least 30 characters"),
    body("experience").trim().notEmpty().withMessage("Experience is required"),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const b = req.body;
      const doc = await Volunteer.create({
        firstName: b.firstName,
        lastName: b.lastName,
        email: b.email,
        phone: b.phone,
        dob: b.dob,
        skills: b.skills,
        availability: b.availability,
        hoursPerWeek: b.hoursPerWeek,
        district: b.district,
        pincode: b.pincode,
        languages: b.languages,
        motivation: b.motivation,
        experience: b.experience,
        cvName: b.cvName,
        ip: req.ip,
      });

      notifyAdmin(
        `New volunteer application: ${doc.firstName} ${doc.lastName}`,
        `${doc.firstName} ${doc.lastName} (${doc.email}, +91 ${doc.phone})\n` +
          `District: ${doc.district}\nSkills: ${doc.skills.join(", ")}\n\n${doc.motivation}`
      );

      sendConfirmation(
        doc.email,
        "Application received — True Life Foundation",
        `<p>Hi ${doc.firstName},</p>
         <p>Thank you for applying to volunteer with <strong>True Life Foundation</strong>! We've received your application and our coordinator will reach out within 3–5 working days.</p>
         <p>Warm regards,<br>True Life Foundation 💚</p>`
      );

      res.status(201).json({ ok: true, id: doc._id });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/volunteers/:id/cv
 * Public — attach a CV file to an existing application.
 * Sent as multipart/form-data with field name "cv".
 */
router.post("/:id/cv", (req, res, next) => {
  uploadCV(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    if (!req.file) return res.status(400).json({ ok: false, message: "No file uploaded." });
    try {
      const doc = await Volunteer.findByIdAndUpdate(
        req.params.id,
        { cvName: req.file.originalname, cvFile: req.file.filename },
        { new: true }
      );
      if (!doc) return res.status(404).json({ ok: false, message: "Application not found." });
      res.json({ ok: true, cvName: doc.cvName });
    } catch (e) {
      next(e);
    }
  });
});

export default router;
