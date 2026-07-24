/**
 * Creates (or updates) an admin login.
 *
 * Usage:
 *   node src/scripts/createAdmin.js <email> <password> ["Full Name"]
 *
 * Example:
 *   node src/scripts/createAdmin.js admin@truelife.org SuperSecret123 "Abhijeet Kumar"
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error('Usage: node src/scripts/createAdmin.js <email> <password> ["Full Name"]');
  process.exit(1);
}

try {
  await connectDB();
  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash, name: name || "" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✅ Admin ready: ${admin.email}`);
} catch (err) {
  console.error("Failed to create admin:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
