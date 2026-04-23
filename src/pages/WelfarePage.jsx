import { useEffect } from "react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "300+", label: "Women in SHGs",       icon: "👩‍👩‍👧" },
  { value: "150+", label: "Families Supported",  icon: "🏠" },
  { value: "3",    label: "Relief Operations",   icon: "🆘" },
  { value: "50+",  label: "Legal Aid Cases",      icon: "⚖️" },
];

const PROGRAMS = [
  {
    icon: "👩‍💼",
    title: "Women's Self-Help Groups (SHGs)",
    status: "Ongoing",
    statusColor: "#7b2d8b",
    year: "Since 2020",
    desc: "We form and nurture SHGs of 15–20 women each, providing financial literacy training, group savings facilitation, and linkages to bank credit so women can start or grow small businesses.",
    outcomes: [
      "20 active SHGs with 300+ women members",
      "Average household income of SHG members up 45%",
      "Rs. 28 lakh in collective savings mobilised",
    ],
  },
  {
    icon: "💸",
    title: "Micro-Finance Linkages",
    status: "Ongoing",
    statusColor: "#7b2d8b",
    year: "Since 2021",
    desc: "We work with nationalised banks and MFIs to help low-income women access formal credit at fair interest rates — replacing predatory moneylenders who charged 60–120% annual interest.",
    outcomes: [
      "Rs. 1.2 crore in loans facilitated for 180 women entrepreneurs",
      "Loan repayment rate of 97% across all linked beneficiaries",
      "Moneylender dependency eliminated in 6 target villages",
    ],
  },
  {
    icon: "⚖️",
    title: "Legal Aid Cell",
    status: "Ongoing",
    statusColor: "#7b2d8b",
    year: "Since 2022",
    desc: "A team of trained paralegal volunteers and empanelled lawyers provides free legal counselling for domestic violence, property disputes, child custody, and government entitlement issues.",
    outcomes: [
      "55 cases resolved through legal aid",
      "32 women helped to access domestic violence protection orders",
      "18 widows successfully claimed property rights",
    ],
  },
  {
    icon: "🆘",
    title: "Disaster Relief Operations",
    status: "Ongoing",
    statusColor: "#7b2d8b",
    year: "As needed",
    desc: "When floods, fires, or other disasters strike, we mobilise within 48 hours — distributing relief kits, temporary shelter support, and psychosocial first aid, then facilitating livelihood recovery.",
    outcomes: [
      "3 major disaster relief operations completed (flood, fire, cyclone)",
      "1,200 families received emergency relief kits",
      "400 families supported in long-term livelihood recovery",
    ],
  },
  {
    icon: "🏗️",
    title: "Housing Assistance",
    status: "Completed",
    statusColor: "#e67e22",
    year: "2021 – 2023",
    desc: "Supported 45 BPL families in accessing central government housing scheme benefits — handling documentation, follow-up with authorities, and material support for home completion.",
    outcomes: [
      "45 families moved into permanent, pucca homes",
      "Average construction time reduced by 4 months vs. unassisted families",
      "100% of beneficiaries had no previous permanent housing",
    ],
  },
  {
    icon: "🎓",
    title: "Girl Child Retention Program",
    status: "Completed",
    statusColor: "#e67e22",
    year: "2020 – 2023",
    desc: "Door-to-door awareness campaigns, parent counselling, and conditional incentive grants to prevent early school drop-out among adolescent girls facing pressure to marry or work.",
    outcomes: [
      "250 girls in grades 8–10 retained in school",
      "Early marriage rate fell by 60% in 4 target villages",
      "Program recognised by State Women & Child Development Dept.",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Meena Kumari",
    role: "SHG Leader, Rajgarh Village",
    quote: "I used to borrow from a moneylender at 10% per month. After joining the SHG and getting a bank loan, I bought a sewing machine. Now I earn Rs. 8,000 a month and have savings in the bank.",
    avatar: "👩‍🦱",
  },
  {
    name: "Anjali Nair",
    role: "Legal Aid Beneficiary",
    quote: "When my husband passed away, his family tried to take our home. I had no idea I had legal rights. The True Life legal team helped me file the right papers. I still have my home.",
    avatar: "👩",
  },
  {
    name: "Raju Yadav",
    role: "Disaster Relief Beneficiary",
    quote: "The floods took everything. Within two days, True Life was there with food, clothes, and a tarpaulin. Six months later, they helped me get a loan to restart my small grocery. I will never forget.",
    avatar: "👨‍🌾",
  },
];

function WelfarePage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="wp-page">

      <div className="wp-hero wp-hero--welfare">
        <div className="wp-hero__overlay" />
        <div className="wp-hero__content">
          <Link to="/" className="wp-back">← Back to Home</Link>
          <div className="wp-hero__badge wp-hero__badge--welfare">🤝 Social Welfare</div>
          <h1 className="wp-hero__title">Empowering Lives,<br />Strengthening Communities</h1>
          <p className="wp-hero__subtitle">
            True dignity goes beyond food and shelter. Our social welfare programs
            tackle the structural barriers that keep vulnerable families trapped —
            lack of income, lack of legal protection, and lack of community voice.
          </p>
        </div>
      </div>

      <div className="wp-statsbar wp-statsbar--welfare">
        <div className="container wp-statsbar__inner">
          {STATS.map((s) => (
            <div key={s.label} className="wp-stat">
              <span className="wp-stat__icon">{s.icon}</span>
              <span className="wp-stat__value">{s.value}</span>
              <span className="wp-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="wp-section">
        <div className="container">
          <div className="wp-intro">
            <span className="section-label">Our Story</span>
            <h2 className="section-title">Building a Safety Net That Lifts</h2>
            <p className="wp-body">
              Poverty is never just one problem. It is a web — lack of income, insecure housing,
              no legal recourse, social exclusion, gender inequality. Our social welfare programs
              are designed to untangle this web, one strand at a time.
            </p>
            <p className="wp-body">
              We focus especially on women, because data consistently shows that when women
              are economically empowered and legally protected, entire families and communities
              benefit. An empowered woman invests in her children's education, her family's health,
              and her community's future.
            </p>
          </div>
        </div>
      </section>

      <section className="wp-section wp-section--tinted">
        <div className="container">
          <span className="section-label">Our Programs</span>
          <h2 className="section-title">What We Run &amp; What We've Done</h2>
          <div className="wp-programs">
            {PROGRAMS.map((p) => (
              <div key={p.title} className="wp-program-card">
                <div className="wp-program-card__header">
                  <span className="wp-program-card__icon">{p.icon}</span>
                  <div>
                    <h3 className="wp-program-card__title">{p.title}</h3>
                    <div className="wp-program-card__meta">
                      <span className="wp-program-card__status" style={{ color: p.statusColor, borderColor: p.statusColor }}>{p.status}</span>
                      <span className="wp-program-card__year">{p.year}</span>
                    </div>
                  </div>
                </div>
                <p className="wp-program-card__desc">{p.desc}</p>
                <div className="wp-program-card__outcomes">
                  <p className="wp-program-card__outcomes-title">Key Outcomes</p>
                  {p.outcomes.map((o, i) => (
                    <div key={i} className="wp-outcome-row">
                      <span className="wp-check wp-check--welfare">✔</span>
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section wp-section--dark" style={{ background: "linear-gradient(135deg,#4a148c,#7b1fa2,#ba68c8)" }}>
        <div className="container">
          <span className="section-label section-label--light">Voices</span>
          <h2 className="section-title" style={{ color: "#fff", marginTop: "14px" }}>Stories of Strength</h2>
          <div className="wp-testimonials">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="wp-testimonial">
                <p className="wp-testimonial__quote">"{t.quote}"</p>
                <div className="wp-testimonial__author">
                  <span className="wp-testimonial__avatar">{t.avatar}</span>
                  <div>
                    <p className="wp-testimonial__name">{t.name}</p>
                    <p className="wp-testimonial__role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section wp-section--tinted">
        <div className="container wp-cta-wrap">
          <h2 className="section-title">Stand With the Vulnerable</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 36px" }}>
            Rs. 3,000 supports one woman in an SHG for a full year.
            Rs. 15,000 funds a complete disaster relief kit for one family.
          </p>
          <div className="wp-cta-btns">
            <Link to="/#donate"          className="btn btn--green">Donate Now</Link>
            <Link to="/work/education"   className="btn btn--outline-green">← Back to Education</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default WelfarePage;