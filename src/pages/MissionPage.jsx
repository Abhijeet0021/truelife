import { useEffect } from "react";
import { Link } from "react-router-dom";

const FOCUS_AREAS = [
  {
    icon: "📚",
    title: "Education & Skill Development",
    desc: "We run after-school programs, scholarship drives, vocational training centres, and digital literacy workshops that equip youth with skills for the 21st-century economy.",
    stats: "500+ students supported annually",
  },
  {
    icon: "🏥",
    title: "Health & Nutrition",
    desc: "From mobile health camps in remote villages to nutrition counselling for mothers and children, we tackle the root causes of poor health with preventive, community-first care.",
    stats: "20+ health camps conducted",
  },
  {
    icon: "👩‍💼",
    title: "Women's Empowerment",
    desc: "Our self-help group network, micro-finance linkages, and entrepreneurship training programs help women achieve financial independence and leadership within their communities.",
    stats: "300+ women enrolled in SHGs",
  },
  {
    icon: "🌾",
    title: "Sustainable Livelihoods",
    desc: "We work with farmers, artisans, and daily-wage workers to diversify income streams, access government schemes, and build financial resilience against economic shocks.",
    stats: "150+ families with new income sources",
  },
  {
    icon: "🤝",
    title: "Community Mobilisation",
    desc: "Lasting change comes from within. We train community leaders, form village-level committees, and facilitate participatory planning so communities become self-governing changemakers.",
    stats: "12 active community committees",
  },
  {
    icon: "🆘",
    title: "Disaster Relief",
    desc: "When crises strike, we respond — distributing relief kits, rebuilding livelihoods, and supporting psychosocial recovery so communities can bounce back stronger.",
    stats: "3 major relief operations completed",
  },
];

const PRINCIPLES = [
  { title: "Community-Led", desc: "We follow the community's lead — listening before acting, co-designing solutions, and building local ownership into every program." },
  { title: "Evidence-Based", desc: "Every initiative is grounded in data. We measure outcomes rigorously and iterate constantly to improve our impact per rupee spent." },
  { title: "Inclusive", desc: "We actively reach the most marginalised — women, children, people with disabilities, and those from socially excluded communities." },
  { title: "Transparent", desc: "We publish audited financials, impact reports, and program updates so donors and communities can hold us accountable." },
];

function MissionPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="detail-page">
      {/* ── Hero Banner ── */}
      <div className="detail-hero detail-hero--mission">
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <Link to="/" className="detail-back">← Back to Home</Link>
          <div className="detail-hero__icon">🎯</div>
          <h1 className="detail-hero__title">Our Mission</h1>
          <p className="detail-hero__subtitle">
            To empower underprivileged communities through education, skill
            development, and health awareness — providing sustainable support
            that fosters self-reliance.
          </p>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="detail-section">
        <div className="container">
          <div className="detail-intro">
            <span className="section-label">Why We Exist</span>
            <h2 className="section-title">A Mission Rooted in Urgency</h2>
            <p className="detail-body">
              Millions of families across India live in conditions of chronic poverty — not
              because they lack ambition or resilience, but because the systems around them
              have consistently failed them. Schools without teachers. Clinics without
              medicines. Opportunities that stop at the village boundary.
            </p>
            <p className="detail-body">
              True Life Foundation exists to bridge these gaps. Our mission is intensely
              practical: we identify the most pressing needs in underserved communities,
              design targeted programs that address root causes (not just symptoms), and
              execute with the discipline and compassion of people who believe every life
              truly matters.
            </p>
          </div>
        </div>
      </section>

      {/* ── Focus Areas ── */}
      <section className="detail-section detail-section--tinted">
        <div className="container">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Our Six Focus Areas</h2>
          <div className="detail-grid detail-grid--3">
            {FOCUS_AREAS.map((area) => (
              <div key={area.title} className="detail-focus-card">
                <div className="detail-focus-card__icon">{area.icon}</div>
                <h3 className="detail-focus-card__title">{area.title}</h3>
                <p className="detail-focus-card__body">{area.desc}</p>
                <div className="detail-focus-card__stat">{area.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guiding Principles ── */}
      <section className="detail-section">
        <div className="container">
          <span className="section-label">How We Work</span>
          <h2 className="section-title">Our Guiding Principles</h2>
          <div className="detail-principles">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="detail-principle">
                <div className="detail-principle__number">0{i + 1}</div>
                <div>
                  <h3 className="detail-principle__title">{p.title}</h3>
                  <p className="detail-principle__desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="detail-section detail-section--dark">
        <div className="container">
          <blockquote className="detail-quote">
            <p>"Our mission is simple: show up, listen deeply, work hard, and never
            stop until every community we serve has the tools to thrive on its own."</p>
            <cite>— True Life Foundation</cite>
          </blockquote>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="detail-section detail-section--tinted">
        <div className="container detail-cta-wrap">
          <h2 className="section-title">Join Our Mission</h2>
          <p className="section-subtitle">
            Whether you donate, volunteer, or spread the word — you become
            part of a movement that is changing lives every single day.
          </p>
          <div className="detail-cta-btns">
            <Link to="/#donate"  className="btn btn--green">Donate Now</Link>
            <Link to="/"         className="btn btn--outline-green">Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MissionPage;