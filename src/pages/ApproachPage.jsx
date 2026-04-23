import { useEffect } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    step: "01",
    title: "Community Needs Assessment",
    desc: "Before launching any program, we spend time on the ground — conducting surveys, holding focus group discussions, and mapping existing resources. We never assume; we ask.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Co-Design with Communities",
    desc: "Solutions designed without community input often fail. We bring beneficiaries into the design process — ensuring programs are culturally relevant, locally owned, and genuinely wanted.",
    icon: "🤝",
  },
  {
    step: "03",
    title: "Pilot & Iterate",
    desc: "We launch small pilots, measure results rigorously, gather feedback, and refine before scaling. This fail-fast approach means we invest more confidently at scale.",
    icon: "🔬",
  },
  {
    step: "04",
    title: "Scale What Works",
    desc: "Programs that show measurable impact are expanded strategically — leveraging government partnerships, corporate CSR, and volunteer networks to reach more communities at lower cost.",
    icon: "📈",
  },
  {
    step: "05",
    title: "Build Local Capacity",
    desc: "Every program is designed with an exit strategy: training local leaders and institutions to sustain outcomes long after our direct involvement ends.",
    icon: "🏗️",
  },
  {
    step: "06",
    title: "Measure & Report Impact",
    desc: "We track key indicators, publish transparent impact reports, and share learnings openly — contributing to the broader development sector's knowledge base.",
    icon: "📊",
  },
];

const PARTNERSHIPS = [
  { type: "Government",    icon: "🏛️", desc: "We align programs with national and state government schemes — acting as a last-mile delivery partner to ensure benefits reach the most excluded." },
  { type: "Corporate CSR", icon: "🏢", desc: "We partner with corporates whose CSR objectives align with our focus areas, bringing financial resources and professional expertise to the table." },
  { type: "Academia",      icon: "🎓", desc: "Research partnerships ensure our programs are evidence-based and contribute to the academic understanding of community development." },
  { type: "Volunteers",    icon: "👥", desc: "Our volunteer network of students, professionals, and retirees brings skills and energy that multiply our impact far beyond what paid staff alone could achieve." },
];

function ApproachPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="detail-page">
      {/* ── Hero Banner ── */}
      <div className="detail-hero detail-hero--approach">
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <Link to="/" className="detail-back">← Back to Home</Link>
          <div className="detail-hero__icon">💡</div>
          <h1 className="detail-hero__title">Our Approach</h1>
          <p className="detail-hero__subtitle">
            Community-driven, evidence-based, and built for lasting impact —
            how we turn compassion into measurable change.
          </p>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="detail-section">
        <div className="container">
          <div className="detail-intro">
            <span className="section-label">The Method</span>
            <h2 className="section-title">How We Create Lasting Change</h2>
            <p className="detail-body">
              Good intentions are not enough. The history of development work is littered
              with well-funded programs that failed because they imposed solutions from
              outside, ignored local context, or measured inputs instead of outcomes.
            </p>
            <p className="detail-body">
              True Life Foundation takes a different path. We believe real change starts
              with deep listening, is built on genuine partnership, and is sustained by
              local ownership. Our approach is systematic, adaptive, and relentlessly
              focused on what actually works — not just what looks good on paper.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6-Step Process ── */}
      <section className="detail-section detail-section--tinted">
        <div className="container">
          <span className="section-label">Our Process</span>
          <h2 className="section-title">A Six-Step Framework</h2>
          <div className="detail-steps">
            {STEPS.map((s) => (
              <div key={s.step} className="detail-step">
                <div className="detail-step__left">
                  <div className="detail-step__number">{s.step}</div>
                  <div className="detail-step__line" />
                </div>
                <div className="detail-step__right">
                  <div className="detail-step__icon">{s.icon}</div>
                  <h3 className="detail-step__title">{s.title}</h3>
                  <p className="detail-step__desc">{s.desc}</p>
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
            <p>"We are not here to rescue communities. We are here to walk alongside
            them — sharing tools, knowledge, and resources until they no longer need us."</p>
            <cite>— True Life Foundation</cite>
          </blockquote>
        </div>
      </section>

      {/* ── Partnerships ── */}
      <section className="detail-section">
        <div className="container">
          <span className="section-label">Collaboration</span>
          <h2 className="section-title">Partnerships That Multiply Impact</h2>
          <p className="section-subtitle" style={{ marginBottom: "48px" }}>
            No single organisation can solve systemic poverty alone. We build
            strategic partnerships that bring complementary strengths to the table.
          </p>
          <div className="detail-grid">
            {PARTNERSHIPS.map((p) => (
              <div key={p.type} className="detail-partner-card">
                <div className="detail-partner-card__icon">{p.icon}</div>
                <h3 className="detail-partner-card__type">{p.type}</h3>
                <p className="detail-partner-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="detail-section detail-section--tinted">
        <div className="container detail-cta-wrap">
          <h2 className="section-title">Partner With Us</h2>
          <p className="section-subtitle">
            Whether you're a corporation, academic institution, or passionate
            individual — there's a role for you in our approach.
          </p>
          <div className="detail-cta-btns">
            <Link to="/#contact" className="btn btn--green">Get in Touch</Link>
            <Link to="/"         className="btn btn--outline-green">Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ApproachPage;