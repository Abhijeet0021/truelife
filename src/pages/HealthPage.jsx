import { useEffect } from "react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "20+",  label: "Health Camps Run",    icon: "🏕️" },
  { value: "3,000+", label: "People Screened",   icon: "🩺" },
  { value: "8",    label: "Partner Hospitals",   icon: "🏥" },
  { value: "600+", label: "Mothers Counselled",  icon: "👩‍👦" },
];

const PROGRAMS = [
  {
    icon: "🚐",
    title: "Mobile Health Camps",
    status: "Ongoing",
    statusColor: "#1565c0",
    year: "Since 2023",
    desc: "Our mobile medical van visits 8 districts monthly, offering free OPD consultations, blood pressure checks, blood sugar tests, and referrals to partner hospitals for follow-up care.",
    outcomes: [
      "3,000+ patients screened across 24 health camp events",
      "450 hypertension and diabetes cases identified early",
      "320 patients successfully referred and treated at partner hospitals",
    ],
  },
  {
    icon: "💊",
    title: "Free Medicine Distribution",
    status: "Ongoing",
    statusColor: "#1565c0",
    year: "Since 2023",
    desc: "We distribute a 3-month supply of essential medicines to BPL cardholders identified through our screening camps, covering chronic conditions like hypertension, diabetes, and asthma.",
    outcomes: [
      "Medicines provided to 800+ BPL beneficiaries",
      "Partnerships with 5 pharmaceutical companies for drug donations",
      "Zero out-of-pocket expense for 100% of beneficiaries",
    ],
  },
  {
    icon: "🍎",
    title: "Nutrition & Maternal Health",
    status: "Ongoing",
    statusColor: "#1565c0",
    year: "Since 2024",
    desc: "Monthly nutrition counselling sessions for pregnant women, new mothers, and children under 5. We distribute iron-folic acid supplements, ready-to-use therapeutic food, and growth monitoring kits.",
    outcomes: [
      "Anaemia prevalence reduced by 28% among enrolled women",
      "Child stunting rates fell from 34% to 21% in 2 target villages",
      "600+ mothers completed the full 6-month nutrition program",
    ],
  },
  {
    icon: "🧠",
    title: "Mental Health Awareness",
    status: "Ongoing",
    statusColor: "#1565c0",
    year: "Since 2023",
    desc: "Workshops in schools and panchayat halls to destigmatise mental health, teach stress management, and identify individuals needing professional support. Led by trained community counsellors.",
    outcomes: [
      "2,500 students and adults attended mental health workshops",
      "80 community counsellors trained and certified",
      "150 individuals connected to professional mental health services",
    ],
  },
  {
    icon: "💉",
    title: "Vaccination Drives",
    status: "Completed",
    statusColor: "#e67e22",
    year: "2024 – 2025",
    desc: "Partnered with district health authorities to run COVID-19 vaccination drives in 15 villages where government reach was limited. Addressed vaccine hesitancy through door-to-door education.",
    outcomes: [
      "8,500 people vaccinated across 15 villages",
      "Vaccination coverage increased from 42% to 89% in target areas",
      "Zero COVID-related deaths in target villages post-campaign",
    ],
  },
  {
    icon: "👁️",
    title: "Eye Care Camp",
    status: "Completed",
    statusColor: "#e67e22",
    year: "2025",
    desc: "A specialised eye care camp in collaboration with a tertiary care hospital offering free eye checkups, cataract surgeries, and corrective spectacles to elderly and school-going patients.",
    outcomes: [
      "1,200 patients received free eye checkups",
      "145 cataract surgeries performed at zero cost",
      "600 school children received corrective spectacles",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Geeta Bai",
    role: "Beneficiary, Mobile Health Camp",
    quote: "I had been ignoring chest pain for two years because I could not afford a doctor. The camp found my blood pressure was dangerously high. They gave me medicine and follow-up free of cost. I am healthy today.",
    avatar: "👵",
  },
  {
    name: "Dr. Arvind Mehta",
    role: "Partner Physician, City Hospital",
    quote: "The True Life team is one of the most organised NGOs I have worked with. Their patient referral system is seamless, and the beneficiaries they send us are genuinely the ones most in need.",
    avatar: "👨‍⚕️",
  },
  {
    name: "Lakshmi Reddy",
    role: "Mother of Two, Nutrition Program",
    quote: "My second child was born underweight. After joining the nutrition program, within six months she was healthy and hitting all growth milestones. I tell every mother in my village to join.",
    avatar: "👩",
  },
];

function HealthPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="wp-page">

      <div className="wp-hero wp-hero--health">
        <div className="wp-hero__overlay" />
        <div className="wp-hero__content">
          <Link to="/" className="wp-back">← Back to Home</Link>
          <div className="wp-hero__badge wp-hero__badge--health">🏥 Health Awareness</div>
          <h1 className="wp-hero__title">Healthy Communities,<br />Brighter Futures</h1>
          <p className="wp-hero__subtitle">
            Good health is not a privilege — it is a right. Our health programs
            bring preventive care, medicines, and wellness education directly to
            the doorstep of those who need it most.
          </p>
        </div>
      </div>

      <div className="wp-statsbar wp-statsbar--health">
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
            <h2 className="section-title">Healthcare That Reaches Everyone</h2>
            <p className="wp-body">
              In India, the nearest public health centre can be 20 km away. The nearest
              specialist, even further. For daily-wage workers, one sick day means no food on
              the table. For pregnant women in remote villages, a routine complication can
              become fatal simply because help is not nearby.
            </p>
            <p className="wp-body">
              True Life Foundation's health programs are built around one principle: if the
              community cannot reach the healthcare system, the healthcare system must reach
              the community. We bring doctors, medicines, and health education to the people —
              not the other way around.
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
                      <span className="wp-check wp-check--health">✔</span>
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section wp-section--dark" style={{ background: "linear-gradient(135deg,#0d47a1,#1565c0,#42a5f5)" }}>
        <div className="container">
          <span className="section-label section-label--light">Voices</span>
          <h2 className="section-title" style={{ color: "#fff", marginTop: "14px" }}>Stories of Healing</h2>
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
          <h2 className="section-title">Help Us Heal More Lives</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 36px" }}>
            Rs. 2,000 sponsors one patient's full medical care at a health camp.
            Rs. 10,000 funds medicines for a BPL family for one year.
          </p>
          <div className="wp-cta-btns">
            <Link to="/#donate"      className="btn btn--green">Donate Now</Link>
            <Link to="/work/welfare" className="btn btn--outline-green">Next: Social Welfare →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HealthPage;