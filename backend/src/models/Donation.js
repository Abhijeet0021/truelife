import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    // Amount is stored in paise (Razorpay's smallest unit). 50000 = ₹500.
    amount:   { type: Number, required: true, min: 100 },
    currency: { type: String, default: "INR" },

    // Optional donor details
    name:  { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true },

    // Razorpay identifiers
    orderId:   { type: String, required: true, index: true },
    paymentId: { type: String },
    signature: { type: String },

    // Receipt number, assigned once the donation is paid (e.g. TL-2026-4F9K2A)
    receiptNo: { type: String },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
