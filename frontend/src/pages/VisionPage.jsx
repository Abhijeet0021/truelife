import { useEffect } from "react";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    icon: "🎓",
    title: "Universal Education",
    desc: "We envision a future where no child is denied access to quality education due to economic hardship. Every learner deserves a safe, nurturing environment that unlocks their full potential.",
  },
  {
    icon: "🏥",
    title: "Health for All",
    desc: "A world where preventable diseases no longer claim lives, and every family has access to basic healthcare, nutrition, and mental wellness support — regardless of geography or income.",
  },
  {
    icon: "⚖️",
    title: "Social Dignity",
    desc: "We stand for a society free from discrimination, where every individual — irrespective of gender, caste, or background — can participate equally in community life and economic opportunity.",
  },
  {
    icon: "🌱",
    title: "Sustainable Communities",
    desc: "Our vision includes communities that are environmentally conscious and economically resilient, able to sustain themselves and thrive for generations to come.",
  },
];

const TIMELINE = [
  { year: "2023", text: "Foundation established with a focus on rural education and expanded into health awareness campaigns across 5 districts." },
  { year: "2024", text: "Launched women's empowerment and livelihood programs." },
  { year: "2025", text: "Reached 1,000+ beneficiaries across 12 communities." },
  { year: "2026", text: "Vision 2025: Impact 10,000 lives across India." },
];

function VisionPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="detail-page">
      {/* ── Hero Banner ── */}
      <div className="detail-hero detail-hero--vision">
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          <Link to="/" className="detail-back">← Back to Home</Link>
          <div className="detail-hero__icon">🌅</div>
          <h1 className="detail-hero__title">Our Vision</h1>
          <p className="detail-hero__subtitle">
            A world where every individual has the opportunity to lead a
            healthy, educated, and dignified life — regardless of circumstance.
          </p>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="detail-section">
        <div className="container">
          <div className="detail-intro">
            <span className="section-label">The Big Picture</span>
            <h2 className="section-title">What We're Working Towards</h2>
            <p className="detail-body">
              At True Life Foundation, our vision is not just an aspiration — it is the
              compass that guides every program we design, every partnership we form, and
              every rupee we invest. We believe that poverty, illiteracy, and ill-health
              are not inevitable. They are problems that can be solved through sustained
              collective action, compassionate leadership, and community empowerment.
            </p>
            <p className="detail-body">
              We envision an India — and ultimately a world — where the accident of birth
              does not determine the arc of a life. Where a child born in a remote village
              has the same shot at a bright future as one born in a city. Where a woman in
              a marginalized community can access the resources she needs to become
              economically independent. Where communities have the tools, knowledge, and
              agency to solve their own problems.
            </p>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ── */}
      <section className="detail-section detail-section--tinted">
        <div className="container">
          <span className="section-label">Core Pillars</span>
          <h2 className="section-title">The Four Pillars of Our Vision</h2>
          <div className="detail-grid">
            {PILLARS.map((p) => (
              <div key={p.title} className="detail-pillar-card">
                <div className="detail-pillar-card__icon">{p.icon}</div>
                <h3 className="detail-pillar-card__title">{p.title}</h3>
                <p className="detail-pillar-card__body">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="detail-section detail-section--dark">
        <div className="container">
          <blockquote className="detail-quote">
            <p>"The best way to predict the future is to create it — and we choose to
            create one where no life is left behind."</p>
            <cite>— True Life Foundation</cite>
          </blockquote>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="detail-section">
        <div className="container">
          <span className="section-label">Our Journey</span>
          <h2 className="section-title">Milestones Toward Our Vision</h2>
          <div className="detail-timeline">
            {TIMELINE.map((item, i) => (
              <div key={i} className="detail-timeline__item">
                <div className="detail-timeline__year">{item.year}</div>
                <div className="detail-timeline__dot" />
                <div className="detail-timeline__text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="detail-section detail-section--tinted">
        <div className="container detail-cta-wrap">
          <h2 className="section-title">Be Part of the Vision</h2>
          <p className="section-subtitle">
            Every donation, every volunteer hour, and every partnership brings
            us one step closer to the world we're building together.
          </p>
          <div className="detail-cta-btns">
            <Link to="/#donate" className="btn btn--green">Donate Now</Link>
            <Link to="/"        className="btn btn--outline-green">Explore More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VisionPage;