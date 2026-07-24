import { useState } from "react";
import { api } from "../services/api";

const PRESETS = [500, 1000, 5000];

/* ── Your organisation's details ──
   If you later register for 80G tax exemption, set has80G = true and fill in
   pan + reg80G to add the tax-exemption line to receipts. */
const ORG = {
  name: "True Life Foundation",
  address: "India",
  email: "singhabhijeet0021@gmail.com",
  phone: "+91 74618 00396",
  has80G: false,
  pan: "",
  reg80G: "",
};

/** Loads the Razorpay Checkout script once, on demand. */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Opens a clean, printable receipt the donor can save as PDF. */
function openReceipt(d) {
  const rupees = (d.amount / 100).toLocaleString("en-IN");
  const date = new Date(d.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${d.receiptNo || ""}</title>
  <style>
    body{font-family:system-ui,sans-serif;color:#1f2937;max-width:640px;margin:40px auto;padding:0 24px}
    .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #16a34a;padding-bottom:16px}
    h1{color:#14532d;margin:0 0 4px;font-size:22px}
    .muted{color:#6b7280;font-size:13px;line-height:1.5}
    .badge{background:#dcfce7;color:#166534;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:700}
    table{width:100%;border-collapse:collapse;margin:24px 0}
    td{padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px}
    td:last-child{text-align:right;font-weight:600}
    .amt{font-size:26px;font-weight:800;color:#16a34a}
    .foot{margin-top:28px;font-size:12px;color:#6b7280;line-height:1.6}
    @media print{button{display:none}}
  </style></head><body>
    <div class="top">
      <div><h1>${ORG.name}</h1><div class="muted">${ORG.address}<br>${ORG.email} · ${ORG.phone}</div></div>
      <div class="badge">DONATION RECEIPT</div>
    </div>
    <table>
      <tr><td>Receipt No.</td><td>${d.receiptNo || "—"}</td></tr>
      <tr><td>Date</td><td>${date}</td></tr>
      <tr><td>Received from</td><td>${d.name || "Anonymous"}</td></tr>
      ${d.email ? `<tr><td>Email</td><td>${d.email}</td></tr>` : ""}
      ${d.phone ? `<tr><td>Phone</td><td>${d.phone}</td></tr>` : ""}
      <tr><td>Payment ID</td><td>${d.paymentId || "—"}</td></tr>
      <tr><td>Amount donated</td><td class="amt">₹${rupees}</td></tr>
    </table>
    <div class="foot">
      ${ORG.has80G
        ? `Donations to ${ORG.name} are eligible for tax deduction under Section 80G of the Income Tax Act, 1961.<br>PAN: ${ORG.pan} · 80G Reg. No.: ${ORG.reg80G}<br><br>`
        : ``}
      This is a computer-generated receipt and does not require a signature. Thank you for your generosity. 💚
    </div>
    <button onclick="window.print()" style="margin-top:24px;padding:12px 28px;background:#16a34a;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Print / Save as PDF</button>
  </body></html>`;

  const w = window.open("", "_blank", "width=720,height=800");
  if (w) { w.document.write(html); w.document.close(); }
}

function Donate() {
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [donor, setDonor] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("");   // "", "processing", "success", "error"
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  const chosenAmount = custom ? Number(custom) : amount;
  const setField = (k) => (e) => setDonor({ ...donor, [k]: e.target.value });

  const inputStyle = {
    padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.12)", color: "#fff", width: "100%", boxSizing: "border-box",
  };

  const handleDonate = async () => {
    setStatus("processing");
    setMessage("");

    if (!chosenAmount || chosenAmount < 1) {
      setStatus("error");
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      const cfg = await api.donationConfig();
      if (!cfg.enabled) {
        setStatus("error");
        setMessage("Online donations aren't available yet. Please check back soon.");
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load the payment gateway.");

      const order = await api.createOrder({ amount: chosenAmount, ...donor });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: ORG.name,
        description: "Donation",
        order_id: order.orderId,
        theme: { color: "#16a34a" },
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        handler: async (response) => {
          try {
            const res = await api.verifyPayment(response);
            setReceipt(res.donation);
            setStatus("success");
            setMessage("Thank you for your generous donation! 💚");
          } catch {
            setStatus("error");
            setMessage("Payment received but could not be verified. We'll be in touch.");
          }
        },
        modal: { ondismiss: () => setStatus("") },
      });
      rzp.open();
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__card">
          <span className="donate__emoji">💚</span>

          <h2 className="donate__title">Make a Donation</h2>

          <p className="donate__subtitle">
            Your generous contribution helps us continue our vital work and
            reach more communities in need. Every rupee counts.
          </p>

          {status === "success" ? (
            <div>
              <p className="donate__note" style={{ fontSize: "1.15rem", color: "#fff", marginBottom: 8 }}>
                {message}
              </p>
              {receipt?.receiptNo && (
                <p className="donate__note" style={{ color: "#fff" }}>
                  Receipt No. <strong>{receipt.receiptNo}</strong>
                </p>
              )}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
                {receipt && (
                  <button className="btn btn--white-solid" onClick={() => openReceipt(receipt)}>
                    📄 Download Receipt
                  </button>
                )}
                <button
                  className="btn btn--ghost"
                  onClick={() => { setStatus(""); setReceipt(null); setDonor({ name: "", email: "", phone: "" }); }}
                >
                  Donate Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Quick-select amounts */}
              <div className="donate__amounts">
                {PRESETS.map((amt) => (
                  <button
                    key={amt}
                    className={`btn btn--ghost ${!custom && amount === amt ? "btn--ghost-on" : ""}`}
                    onClick={() => { setAmount(amt); setCustom(""); }}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
                <input
                  type="number" min="1" placeholder="Custom ₹"
                  value={custom} onChange={(e) => setCustom(e.target.value)}
                  className="donate__custom-input"
                  style={{ ...inputStyle, width: 120 }}
                />
              </div>

              {/* Donor details (for receipt) */}
              <div style={{ display: "grid", gap: 10, maxWidth: 420, margin: "0 auto 18px" }}>
                <input style={inputStyle} placeholder="Your name (for receipt)"
                  value={donor.name} onChange={setField("name")} />
                <input style={inputStyle} type="email" placeholder="Email (to receive receipt)"
                  value={donor.email} onChange={setField("email")} />
                <input style={inputStyle} placeholder="Phone (optional)"
                  value={donor.phone} onChange={setField("phone")} />
              </div>

              {/* Main CTA */}
              <button className="btn btn--white-solid" onClick={handleDonate} disabled={status === "processing"}>
                {status === "processing"
                  ? "Processing…"
                  : `🔒 Donate ₹${(chosenAmount || 0).toLocaleString("en-IN")} Securely`}
              </button>

              {status === "error" && (
                <p className="donate__note" style={{ color: "#fecaca" }}>⚠ {message}</p>
              )}

              <p className="donate__note">
                You'll receive a receipt for your donation after payment.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Donate;
