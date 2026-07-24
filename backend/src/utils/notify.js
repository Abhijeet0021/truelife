/**
 * Email helper (via SMTP / nodemailer).
 *
 * Enabled only when SMTP settings are present in the environment. If they're
 * missing, every function here silently no-ops so the API keeps working.
 *
 * For Gmail: create an "App Password" (Google Account → Security → 2-Step
 * Verification → App passwords) and use it as SMTP_PASS.
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465
 *   SMTP_USER=youraddress@gmail.com
 *   SMTP_PASS=your-16-char-app-password
 *   NOTIFY_EMAIL=where-to-receive-alerts@gmail.com
 */
let transportPromise = null;

function getTransport() {
  const { SMTP_HOST, SMTP_USER } = process.env;
  if (!SMTP_HOST || !SMTP_USER) return null;

  if (!transportPromise) {
    transportPromise = import("nodemailer")
      .then(({ default: nodemailer }) =>
        nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })
      )
      .catch((err) => {
        console.warn("nodemailer not available:", err.message);
        return null;
      });
  }
  return transportPromise;
}

async function send({ to, subject, text, html }) {
  const transport = await getTransport();
  if (!transport || !to) return;
  try {
    await transport.sendMail({
      from: `"True Life Foundation" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.warn("email send failed:", err.message);
  }
}

/** Alert the organisation's inbox about a new submission. */
export function notifyAdmin(subject, text) {
  return send({ to: process.env.NOTIFY_EMAIL, subject, text });
}

/** Send a confirmation/thank-you email to the person who submitted. */
export function sendConfirmation(to, subject, html) {
  return send({ to, subject, html });
}

/* Backwards-compatible alias (older code called notify()). */
export const notify = notifyAdmin;
