import { Router } from "express";
import crypto from "crypto";
import { body } from "express-validator";
import Donation from "../models/Donation.js";
import { getRazorpay } from "../config/razorpay.js";
import { handleValidation } from "../utils/validate.js";
import { notifyAdmin, sendConfirmation } from "../utils/notify.js";

const router = Router();

/**
 * GET /api/donations/config
 * Public — returns the Razorpay key_id the frontend Checkout needs.
 * (The secret is never exposed.)
 */
router.get("/config", (req, res) => {
  res.json({
    ok: true,
    keyId: process.env.RAZORPAY_KEY_ID || null,
    enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

/**
 * POST /api/donations/order
 * Public — create a Razorpay order and a pending Donation record.
 * Body: { amount (in rupees), name?, email?, phone? }
 */
router.post(
  "/order",
  [
    body("amount").isFloat({ min: 1 }).withMessage("Amount must be at least ₹1"),
    body("email").optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const razorpay = getRazorpay();
      if (!razorpay) {
        return res.status(503).json({ ok: false, message: "Payments are not configured yet." });
      }

      const amountPaise = Math.round(Number(req.body.amount) * 100);

      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: `don_${Date.now()}`,
        notes: { name: req.body.name || "", email: req.body.email || "" },
      });

      await Donation.create({
        amount: amountPaise,
        currency: "INR",
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        orderId: order.id,
        status: "created",
      });

      res.status(201).json({
        ok: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/donations/verify
 * Public — verify the payment signature returned by Razorpay Checkout,
 * then mark the Donation as paid.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post(
  "/verify",
  [
    body("razorpay_order_id").notEmpty(),
    body("razorpay_payment_id").notEmpty(),
    body("razorpay_signature").notEmpty(),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const valid = expected === razorpay_signature;

      const update = {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: valid ? "paid" : "failed",
      };

      // Assign a human-readable receipt number on successful payment.
      if (valid) {
        const year = new Date().getFullYear();
        const suffix = razorpay_payment_id.slice(-6).toUpperCase();
        update.receiptNo = `TL-${year}-${suffix}`;
      }

      const donation = await Donation.findOneAndUpdate(
        { orderId: razorpay_order_id },
        update,
        { new: true }
      );

      if (!valid) {
        return res.status(400).json({ ok: false, message: "Payment verification failed." });
      }

      // Notify admin and email the donor a receipt (both no-op if email off).
      const rupees = (donation.amount / 100).toLocaleString("en-IN");
      notifyAdmin(
        `New donation: ₹${rupees}`,
        `${donation.name || "Anonymous"} donated ₹${rupees} (receipt ${donation.receiptNo}, payment ${donation.paymentId}).`
      );
      if (donation.email) {
        sendConfirmation(
          donation.email,
          `Your donation receipt ${donation.receiptNo} — True Life Foundation`,
          `<p>Dear ${donation.name || "Donor"},</p>
           <p>Thank you for your generous donation of <strong>₹${rupees}</strong> to True Life Foundation.</p>
           <p>Receipt No: <strong>${donation.receiptNo}</strong><br>Payment ID: ${donation.paymentId}</p>
           <p>Your support makes a real difference. 💚</p>
           <p>Warm regards,<br>True Life Foundation</p>`
        );
      }

      // Return the full donation so the frontend can render a receipt.
      res.json({
        ok: true,
        status: "paid",
        donation: {
          id: donation?._id,
          receiptNo: donation?.receiptNo,
          amount: donation?.amount,
          name: donation?.name,
          email: donation?.email,
          phone: donation?.phone,
          paymentId: donation?.paymentId,
          createdAt: donation?.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
