import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: 120 },
    email:   { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    // Light spam/audit metadata
    ip:      { type: String },
    handled: { type: Boolean, default: false }, // toggled from the admin dashboard
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
