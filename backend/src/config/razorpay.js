import Razorpay from "razorpay";

let instance = null;

/**
 * Returns a shared Razorpay client, or null if keys aren't configured.
 * Configuring keys is optional so the rest of the API can boot without them.
 */
export function getRazorpay() {
  if (instance) return instance;

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return null;

  instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  return instance;
}
