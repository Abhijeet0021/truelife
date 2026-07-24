import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName:  { type: String, required: true, trim: true, maxlength: 80 },
    email:     { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone:     { type: String, required: true, trim: true }, // stored as 10-digit; +91 assumed
    dob:       { type: String }, // ISO date string from the form

    skills:       { type: [String], default: [] },
    availability: { type: [String], default: [] }, // days of week
    hoursPerWeek: { type: String },

    district:  { type: String },
    pincode:   { type: String },
    languages: { type: [String], default: [] },

    motivation: { type: String, required: true, maxlength: 5000 },
    experience: { type: String },
    cvName:     { type: String }, // original file name shown in the dashboard
    cvFile:     { type: String }, // stored filename on disk (in uploads/)

    status: {
      type: String,
      enum: ["new", "reviewing", "contacted", "onboarded", "rejected"],
      default: "new",
    },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Volunteer", volunteerSchema);
