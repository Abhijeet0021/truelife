import { Router } from "express";
import { body } from "express-validator";
import Contact from "../models/Contact.js";
import { handleValidation } from "../utils/validate.js";
import { notifyAdmin, sendConfirmation } from "../utils/notify.js";

const router = Router();

/**
 * POST /api/contact
 * Public — save a contact message.
 */
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 120 }),
    body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("message").trim().isLength({ min: 5, max: 5000 }).withMessage("Message is too short"),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const doc = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        ip: req.ip,
      });

      notifyAdmin(
        `New contact message from ${doc.name}`,
        `From: ${doc.name} <${doc.email}>\n\n${doc.message}`
      );

      sendConfirmation(
        doc.email,
        "We received your message — True Life Foundation",
        `<p>Hi ${doc.name},</p>
         <p>Thank you for reaching out to <strong>True Life Foundation</strong>. We've received your message and will get back to you soon.</p>
         <blockquote style="border-left:3px solid #16a34a;padding-left:12px;color:#555">${doc.message}</blockquote>
         <p>Warm regards,<br>True Life Foundation 💚</p>`
      );

      res.status(201).json({ ok: true, id: doc._id });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
