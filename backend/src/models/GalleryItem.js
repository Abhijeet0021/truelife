import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    type:    { type: String, enum: ["photo", "video"], required: true },
    // Which programme this belongs to (shown on that programme's page).
    category: { type: String, enum: ["education", "health", "welfare", "general"], default: "general", index: true },
    title:   { type: String, trim: true, maxlength: 160 },
    caption: { type: String, trim: true, maxlength: 600 },

    // Photos
    imageUrl:  { type: String }, // public URL served to the browser
    imageFile: { type: String }, // filename on disk (for deletion)

    // Videos (YouTube / Vimeo link)
    videoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryItem", galleryItemSchema);
