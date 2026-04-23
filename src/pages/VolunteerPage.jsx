import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

/* ─── Config — fill these in ─────────────────────────────────
   GOOGLE SHEETS:
     1. Open your Google Sheet → Extensions → Apps Script
     2. Paste the Apps Script code from the comment at the bottom
     3. Deploy as Web App (Anyone can access) → copy the URL here

   EMAILJS:
     1. Sign up at emailjs.com (free tier: 200 emails/month)
     2. Create a service (Gmail recommended)
     3. Create an email template — use variables like {{name}}, {{email}} etc.
     4. Copy Service ID, Template ID, Public Key here
──────────────────────────────────────────────────────────── */
const CONFIG = {
  // Google Apps Script Web App URL
  GOOGLE_SHEET_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",

  // EmailJS credentials
  EMAILJS_SERVICE_ID:  "YOUR_SERVICE_ID",
  EMAILJS_TEMPLATE_ID: "YOUR_TEMPLATE_ID",
  EMAILJS_PUBLIC_KEY:  "YOUR_PUBLIC_KEY",

  // Set to true once you've configured the above
  GOOGLE_SHEET_ENABLED: false,
  EMAILJS_ENABLED:      false,
};

/* ─── Static data ─────────────────────────────────────────── */
const SKILLS = [
  "Teaching / Tutoring", "Healthcare / Medicine", "Legal Aid",
  "Social Work", "Digital / Tech", "Photography / Video",
  "Fundraising", "Logistics / Transport", "Counselling",
  "Accounting / Finance", "Content Writing", "Event Management",
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const DISTRICTS_MH = [
  "Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur",
  "Amravati","Kolhapur","Nanded","Thane","Raigad","Other",
];

const LANGUAGES = ["Hindi","Marathi","Gujarati","English","Urdu","Other"];

const EXPERIENCE_OPTIONS = [
  "No prior experience — first time volunteering",
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

const STEPS = [
  { id: 1, label: "Personal Info",   icon: "👤" },
  { id: 2, label: "Skills & Avail.", icon: "🛠️" },
  { id: 3, label: "Location",        icon: "📍" },
  { id: 4, label: "About You",       icon: "💬" },
  { id: 5, label: "Review",          icon: "✅" },
];

/* ─── Initial form state ──────────────────────────────────── */
const INITIAL = {
  // Step 1
  firstName: "", lastName: "", email: "", phone: "", dob: "",
  // Step 2
  skills: [], availability: [], hoursPerWeek: "",
  // Step 3
  district: "", pincode: "", languages: [],
  // Step 4
  motivation: "", experience: "", cvFile: null, cvName: "",
  agreeTerms: false,
};

/* ─── Helpers ─────────────────────────────────────────────── */
function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

function validate(step, form) {
  const errs = {};
  if (step === 1) {
    if (!form.firstName.trim())  errs.firstName = "First name is required";
    if (!form.lastName.trim())   errs.lastName  = "Last name is required";
    if (!form.email.trim())      errs.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim())      errs.phone     = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit Indian number";
  }
  if (step === 2) {
    if (form.skills.length === 0)      errs.skills       = "Select at least one skill";
    if (form.availability.length === 0) errs.availability = "Select at least one day";
    if (!form.hoursPerWeek)            errs.hoursPerWeek = "Please select availability";
  }
  if (step === 3) {
    if (!form.district)               errs.district  = "Select your district";
    if (form.languages.length === 0)  errs.languages = "Select at least one language";
  }
  if (step === 4) {
    if (form.motivation.trim().length < 30) errs.motivation = "Please write at least 30 characters";
    if (!form.experience)                   errs.experience = "Please select your experience level";
    if (!form.agreeTerms)                   errs.agreeTerms = "You must agree to continue";
  }
  return errs;
}

/* ─── Sub-components ──────────────────────────────────────── */
function Field({ label, required, error, children }) {
  return (
    <div className="vf-field">
      <label className="vf-label">
        {label} {required && <span className="vf-required">*</span>}
      </label>
      {children}
      {error && <p className="vf-error">⚠ {error}</p>}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle, error }) {
  return (
    <>
      <div className="vf-chips">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            className={`vf-chip ${selected.includes(opt) ? "vf-chip--on" : ""}`}
            onClick={() => onToggle(opt)}
          >
            {selected.includes(opt) ? "✓ " : ""}{opt}
          </button>
        ))}
      </div>
      {error && <p className="vf-error">⚠ {error}</p>}
    </>
  );
}

/* ─── Step components ─────────────────────────────────────── */
function Step1({ form, set, errors }) {
  return (
    <div className="vf-step-body">
      <div className="vf-row-2">
        <Field label="First Name" required error={errors.firstName}>
          <input className={`vf-input ${errors.firstName ? "vf-input--err" : ""}`}
            value={form.firstName} onChange={e => set("firstName", e.target.value)}
            placeholder="e.g. Ankit" />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <input className={`vf-input ${errors.lastName ? "vf-input--err" : ""}`}
            value={form.lastName} onChange={e => set("lastName", e.target.value)}
            placeholder="e.g. Singh" />
        </Field>
      </div>
      <Field label="Email Address" required error={errors.email}>
        <input type="email" className={`vf-input ${errors.email ? "vf-input--err" : ""}`}
          value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="you@example.com" />
      </Field>
      <Field label="Phone Number" required error={errors.phone}>
        <div className="vf-phone-wrap">
          <span className="vf-phone-code">🇮🇳 +91</span>
          <input className={`vf-input vf-input--phone ${errors.phone ? "vf-input--err" : ""}`}
            value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g,"").slice(0,10))}
            placeholder="7461800396" maxLength={10} />
        </div>
      </Field>
      <Field label="Date of Birth">
        <input type="date" className="vf-input"
          value={form.dob} onChange={e => set("dob", e.target.value)}
          max={new Date().toISOString().split("T")[0]} />
      </Field>
    </div>
  );
}

function Step2({ form, set, errors }) {
  return (
    <div className="vf-step-body">
      <Field label="Skills & Expertise" required error={errors.skills}>
        <p className="vf-hint">Select all areas where you can contribute</p>
        <ChipGroup options={SKILLS} selected={form.skills}
          onToggle={v => set("skills", toggleArr(form.skills, v))} error={null} />
      </Field>

      <Field label="Available Days" required error={errors.availability}>
        <p className="vf-hint">Which days can you volunteer?</p>
        <ChipGroup options={DAYS} selected={form.availability}
          onToggle={v => set("availability", toggleArr(form.availability, v))} error={null} />
        {errors.availability && <p className="vf-error">⚠ {errors.availability}</p>}
      </Field>

      <Field label="Hours per Week" required error={errors.hoursPerWeek}>
        <select className="vf-input" value={form.hoursPerWeek}
          onChange={e => set("hoursPerWeek", e.target.value)}>
          <option value="">Select…</option>
          <option>1–3 hours</option>
          <option>4–6 hours</option>
          <option>7–10 hours</option>
          <option>10+ hours (highly committed)</option>
        </select>
      </Field>
    </div>
  );
}

function Step3({ form, set, errors }) {
  return (
    <div className="vf-step-body">
      <Field label="District" required error={errors.district}>
        <select className={`vf-input ${errors.district ? "vf-input--err" : ""}`}
          value={form.district} onChange={e => set("district", e.target.value)}>
          <option value="">Select your district…</option>
          {DISTRICTS_MH.map(d => <option key={d}>{d}</option>)}
        </select>
      </Field>

      <Field label="PIN Code">
        <input className="vf-input" value={form.pincode}
          onChange={e => set("pincode", e.target.value.replace(/\D/g,"").slice(0,6))}
          placeholder="e.g. 400001" maxLength={6} />
      </Field>

      <Field label="Languages Spoken" required error={errors.languages}>
        <p className="vf-hint">Select languages you're comfortable working in</p>
        <ChipGroup options={LANGUAGES} selected={form.languages}
          onToggle={v => set("languages", toggleArr(form.languages, v))} error={null} />
        {errors.languages && <p className="vf-error">⚠ {errors.languages}</p>}
      </Field>
    </div>
  );
}

function Step4({ form, set, errors }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("File must be under 2 MB"); return; }
    set("cvFile", file);
    set("cvName", file.name);
  };

  return (
    <div className="vf-step-body">
      <Field label="Why do you want to volunteer with us?" required error={errors.motivation}>
        <p className="vf-hint">Tell us what drives you (min. 30 characters)</p>
        <textarea className={`vf-textarea ${errors.motivation ? "vf-input--err" : ""}`}
          rows={5} value={form.motivation}
          onChange={e => set("motivation", e.target.value)}
          placeholder="I want to volunteer because…" />
        <p className="vf-char-count">{form.motivation.length} characters</p>
      </Field>

      <Field label="Prior Volunteering / NGO Experience" required error={errors.experience}>
        <div className="vf-radio-group">
          {EXPERIENCE_OPTIONS.map(opt => (
            <label key={opt} className={`vf-radio ${form.experience === opt ? "vf-radio--on" : ""}`}>
              <input type="radio" name="experience" value={opt}
                checked={form.experience === opt}
                onChange={() => set("experience", opt)} />
              {opt}
            </label>
          ))}
        </div>
        {errors.experience && <p className="vf-error">⚠ {errors.experience}</p>}
      </Field>

      <Field label="Upload CV / Resume (optional)">
        <p className="vf-hint">PDF or Word, max 2 MB</p>
        <div className="vf-file-drop" onClick={() => fileRef.current.click()}>
          <span className="vf-file-icon">📎</span>
          <span>{form.cvName || "Click to upload your CV"}</span>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx"
            style={{ display:"none" }} onChange={handleFile} />
        </div>
        {form.cvName && (
          <div className="vf-file-selected">
            ✓ {form.cvName}
            <button type="button" onClick={() => { set("cvFile",null); set("cvName",""); }}>✕</button>
          </div>
        )}
      </Field>

      <div className="vf-terms">
        <label className={`vf-checkbox-label ${errors.agreeTerms ? "vf-checkbox-label--err" : ""}`}>
          <input type="checkbox" checked={form.agreeTerms}
            onChange={e => set("agreeTerms", e.target.checked)} />
          <span>
            I agree to be contacted by True Life Foundation regarding volunteer opportunities.
            My data will not be shared with third parties.
          </span>
        </label>
        {errors.agreeTerms && <p className="vf-error">⚠ {errors.agreeTerms}</p>}
      </div>
    </div>
  );
}

function Step5Review({ form }) {
  const Row = ({ label, value }) => value ? (
    <div className="vf-review-row">
      <span className="vf-review-label">{label}</span>
      <span className="vf-review-value">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  ) : null;

  return (
    <div className="vf-step-body">
      <p className="vf-review-intro">
        Please review your details before submitting. You can go back to edit any section.
      </p>

      <div className="vf-review-section">
        <h3 className="vf-review-section-title">👤 Personal Information</h3>
        <Row label="Name"    value={`${form.firstName} ${form.lastName}`} />
        <Row label="Email"   value={form.email} />
        <Row label="Phone"   value={`+91 ${form.phone}`} />
        <Row label="DOB"     value={form.dob} />
      </div>

      <div className="vf-review-section">
        <h3 className="vf-review-section-title">🛠️ Skills & Availability</h3>
        <Row label="Skills"         value={form.skills} />
        <Row label="Available Days" value={form.availability} />
        <Row label="Hours/Week"     value={form.hoursPerWeek} />
      </div>

      <div className="vf-review-section">
        <h3 className="vf-review-section-title">📍 Location</h3>
        <Row label="District"   value={form.district} />
        <Row label="PIN Code"   value={form.pincode} />
        <Row label="Languages"  value={form.languages} />
      </div>

      <div className="vf-review-section">
        <h3 className="vf-review-section-title">💬 About You</h3>
        <Row label="Experience"  value={form.experience} />
        <Row label="Motivation"  value={form.motivation} />
        <Row label="CV Uploaded" value={form.cvName || "—"} />
      </div>
    </div>
  );
}

/* ─── Success screen ──────────────────────────────────────── */
function SuccessScreen({ name }) {
  return (
    <div className="vf-success">
      <div className="vf-success__icon">🎉</div>
      <h2 className="vf-success__title">Thank you, {name}!</h2>
      <p className="vf-success__body">
        Your volunteer application has been received. Our team will review it
        and reach out to you within <strong>3–5 working days</strong> via email
        or phone to discuss next steps.
      </p>
      <div className="vf-success__steps">
        {[
          { icon: "📧", step: "Check your email for a confirmation" },
          { icon: "📞", step: "Our coordinator will call you within 5 days" },
          { icon: "🤝", step: "Orientation session will be scheduled" },
          { icon: "🌍", step: "Start making an impact!" },
        ].map(s => (
          <div key={s.step} className="vf-success__step">
            <span>{s.icon}</span>
            <span>{s.step}</span>
          </div>
        ))}
      </div>
      <div className="vf-success__btns">
        <Link to="/" className="btn btn--green">Back to Home</Link>
        <Link to="/#donate" className="btn btn--outline-green">Make a Donation</Link>
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function VolunteerPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [step,      setStep]      = useState(1);
  const [form,      setForm]      = useState(INITIAL);
  const [errors,    setErrors]    = useState({});
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const goNext = () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Submit handler ── */
  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = {
      timestamp:    new Date().toISOString(),
      name:         `${form.firstName} ${form.lastName}`,
      email:        form.email,
      phone:        `+91 ${form.phone}`,
      dob:          form.dob,
      skills:       form.skills.join(", "),
      availability: form.availability.join(", "),
      hoursPerWeek: form.hoursPerWeek,
      district:     form.district,
      pincode:      form.pincode,
      languages:    form.languages.join(", "),
      experience:   form.experience,
      motivation:   form.motivation,
      cvUploaded:   form.cvName || "None",
    };

    try {
      /* ── 1. Google Sheets ── */
      if (CONFIG.GOOGLE_SHEET_ENABLED) {
        await fetch(CONFIG.GOOGLE_SHEET_URL, {
          method: "POST",
          mode:   "no-cors",
          headers: { "Content-Type": "application/json" },
          body:   JSON.stringify(payload),
        });
      }

      /* ── 2. EmailJS ── */
      if (CONFIG.EMAILJS_ENABLED) {
        const { default: emailjs } = await import("@emailjs/browser");
        await emailjs.send(
          CONFIG.EMAILJS_SERVICE_ID,
          CONFIG.EMAILJS_TEMPLATE_ID,
          payload,
          CONFIG.EMAILJS_PUBLIC_KEY
        );
      }

      /* ── Simulate delay if neither is configured ── */
      if (!CONFIG.GOOGLE_SHEET_ENABLED && !CONFIG.EMAILJS_ENABLED) {
        await new Promise(r => setTimeout(r, 1200));
        console.log("📋 Volunteer submission (not yet connected):", payload);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="vp-page">

      {/* ── Hero ── */}
      <div className="vp-hero">
        <div className="vp-hero__bg" />
        <div className="vp-hero__inner">
          <Link to="/" className="detail-back" style={{ color: "rgba(255,255,255,0.65)" }}>← Back to Home</Link>
          <div className="vp-hero__pill">🙌 Join the Movement</div>
          <h1 className="vp-hero__title">
            Become a <span className="vp-hero__accent">Volunteer</span>
          </h1>
          <p className="vp-hero__sub">
            Your skills, your time, your passion — that's all we need. Whether
            you're a doctor, teacher, lawyer, or coder, there's a place for you
            in the True Life family.
          </p>
          <div className="vp-hero__stats">
            {[
              { n: "120+", l: "Active volunteers" },
              { n: "5",    l: "Districts covered" },
              { n: "3",    l: "Programs to join"  },
              { n: "~5h",  l: "Avg hrs/week"      },
            ].map(s => (
              <div key={s.l} className="vp-hero__stat">
                <span className="vp-hero__stat-val">{s.n}</span>
                <span className="vp-hero__stat-lbl">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="vp-body">

        {/* Left: sidebar info */}
        <aside className="vp-sidebar">
          <div className="vp-sidebar__card">
            <h3 className="vp-sidebar__title">What to expect</h3>
            {[
              { icon: "📧", text: "Confirmation email within 24 hrs" },
              { icon: "📞", text: "Coordinator call within 5 days"   },
              { icon: "🎓", text: "Free orientation & training"       },
              { icon: "🤝", text: "Matched to your skill & location"  },
              { icon: "📜", text: "Certificate after 3 months"        },
            ].map(i => (
              <div key={i.text} className="vp-sidebar__item">
                <span>{i.icon}</span>
                <span>{i.text}</span>
              </div>
            ))}
          </div>

          <div className="vp-sidebar__card vp-sidebar__card--green">
            <h3 className="vp-sidebar__title vp-sidebar__title--light">Areas we need help in</h3>
            {[
              { icon: "📚", area: "Education & Tutoring" },
              { icon: "🏥", area: "Health Camps"         },
              { icon: "⚖️", area: "Legal Aid"            },
              { icon: "💻", area: "Digital Literacy"     },
              { icon: "📸", area: "Communications"       },
              { icon: "🚛", area: "Logistics"            },
            ].map(a => (
              <div key={a.area} className="vp-sidebar__area">
                <span>{a.icon}</span>
                <span>{a.area}</span>
              </div>
            ))}
          </div>

          <div className="vp-sidebar__card">
            <h3 className="vp-sidebar__title">Questions?</h3>
            <p className="vp-sidebar__text">
              Email us at{" "}
              <a href="mailto:volunteer@truelifefoundation.org" className="vp-sidebar__link">
                volunteer@truelifefoundation.org
              </a>
              <br />or call <strong>+91 74618 00396</strong>
            </p>
          </div>
        </aside>

        {/* Right: multi-step form */}
        <div className="vp-form-wrap">

          {submitted ? (
            <SuccessScreen name={form.firstName} />
          ) : (
            <>
              {/* Step indicators */}
              <div className="vf-steps">
                {STEPS.map(s => (
                  <div key={s.id} className={`vf-step-dot ${step === s.id ? "vf-step-dot--active" : ""} ${step > s.id ? "vf-step-dot--done" : ""}`}>
                    <div className="vf-step-dot__circle">
                      {step > s.id ? "✓" : s.icon}
                    </div>
                    <span className="vf-step-dot__label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="vf-progress-track">
                <div className="vf-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              {/* Form card */}
              <div className="vf-card">
                <div className="vf-card__header">
                  <span className="vf-card__step-icon">{STEPS[step-1].icon}</span>
                  <div>
                    <p className="vf-card__step-num">Step {step} of {STEPS.length}</p>
                    <h2 className="vf-card__title">{STEPS[step-1].label}</h2>
                  </div>
                </div>

                {step === 1 && <Step1 form={form} set={set} errors={errors} />}
                {step === 2 && <Step2 form={form} set={set} errors={errors} />}
                {step === 3 && <Step3 form={form} set={set} errors={errors} />}
                {step === 4 && <Step4 form={form} set={set} errors={errors} />}
                {step === 5 && <Step5Review form={form} />}

                {/* Navigation buttons */}
                <div className="vf-nav">
                  {step > 1 && (
                    <button type="button" className="btn btn--outline-green" onClick={goBack}>
                      ← Back
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  {step < STEPS.length ? (
                    <button type="button" className="btn btn--green" onClick={goNext}>
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--green vf-submit-btn"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <><span className="vf-spinner" /> Submitting…</>
                      ) : (
                        "🙌 Submit Application"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOOGLE APPS SCRIPT — paste this in your Sheet's Script Editor:

   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data  = JSON.parse(e.postData.contents);
     var row   = [
       data.timestamp, data.name, data.email, data.phone, data.dob,
       data.skills, data.availability, data.hoursPerWeek,
       data.district, data.pincode, data.languages,
       data.experience, data.motivation, data.cvUploaded
     ];
     sheet.appendRow(row);
     return ContentService
       .createTextOutput(JSON.stringify({ status: "ok" }))
       .setMimeType(ContentService.MimeType.JSON);
   }

   Then: Deploy → New Deployment → Web App
         Execute as: Me
         Who has access: Anyone
   Copy the deployment URL → paste in CONFIG.GOOGLE_SHEET_URL above
   Set CONFIG.GOOGLE_SHEET_ENABLED = true
────────────────────────────────────────────────────────────── */
