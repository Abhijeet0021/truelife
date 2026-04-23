import { useState } from "react";

const CONTACT_INFO = [
  { icon: "📍", label: "Location", value: "India" },
  { icon: "✉️", label: "Email",    value: "singhabhijeet0021@gmail.com" },
  { icon: "📞", label: "Phone",    value: "+91 7461800396" },
];

const SOCIALS = [
  { label: "Facebook",  symbol: "f" },
  { label: "Twitter",   symbol: "𝕏" },
  { label: "Instagram", symbol: "◻" },
];

function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <span className="section-label">Get In Touch</span>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">
          Have questions or want to get involved? We'd love to hear from you.
        </p>

        <div className="contact__grid">
          {/* ---- Form ---- */}
          <div className="contact-form">
            {submitted ? (
              <div className="form-success">
                <span className="form-success__emoji">✅</span>
                <h3 className="form-success__title">Message Sent!</h3>
                <p className="form-success__body">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  className="btn btn--green"
                  style={{ padding: "12px 32px" }}
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 className="contact-form__title">Send us a message</h3>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Ram Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="ramkumar@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="form-submit">
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ---- Info ---- */}
          <div className="contact-info">
            <h3 className="contact-info__title">We'd love to connect</h3>
            <p className="contact-info__intro">
              Whether you want to volunteer, partner with us, or simply learn
              more about our work — our doors are always open.
            </p>

            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="contact-info-item">
                <span className="contact-info-item__icon">{item.icon}</span>
                <div>
                  <div className="contact-info-item__label">{item.label}</div>
                  <div className="contact-info-item__value">{item.value}</div>
                </div>
              </div>
            ))}

            <div className="social-links">
              {SOCIALS.map((s) => (
                <button
                  key={s.label}
                  className="social-btn"
                  title={s.label}
                  aria-label={s.label}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
