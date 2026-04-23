import { useEffect } from "react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "500+",  label: "Students Supported",  icon: "🎓" },
  { value: "12",    label: "Learning Centres",     icon: "🏫" },
  { value: "85%",   label: "Exam Pass Rate",       icon: "📈" },
  { value: "₹40L+", label: "Scholarships Awarded", icon: "💰" },
];

const PROGRAMS = [
  {
    icon: "📖",
    title: "After-School Tutoring",
    status: "Ongoing",
    statusColor: "#2d6a4f",
    year: "Since 2022",
    desc: "Free evening tutoring sessions run across 12 rural villages, covering Maths, Science, and English for students in classes 6–12. Staffed by 45 trained volunteer educators.",
    outcomes: [
      "Average grades improved by 32% within one academic year",
      "Drop-out rate reduced from 18% to 4% in target villages",
      "120 students advanced to higher secondary education",
    ],
  },
  {
    icon: "💻",
    title: "Digital Literacy Labs",
    status: "Ongoing",
    statusColor: "#2d6a4f",
    year: "Since 2023",
    desc: "We set up 4 computer labs in under-resourced schools, each with 50 computers, internet access, and a trained facilitator. Students learn typing, MS Office, internet safety, and basic coding.",
    outcomes: [
      "200+ computers installed across 4 schools",
      "1,200 students completed the 3-month digital literacy course",
      "60 students enrolled in advanced coding bootcamp",
    ],
  },
  {
    icon: "🎓",
    title: "Scholarship Fund",
    status: "Ongoing",
    statusColor: "#2d6a4f",
    year: "Since 2022",
    desc: "Merit-cum-means scholarships covering tuition, books, and transport for students from BPL families. Recipients are selected through a transparent committee process and mentored throughout.",
    outcomes: [
      "Rs. 40 lakh disbursed to 120 scholarship recipients",
      "92% scholarship students graduated on time",
      "18 scholars enrolled in engineering or medical colleges",
    ],
  },
  {
    icon: "🔧",
    title: "Vocational Training Centre",
    status: "Ongoing",
    statusColor: "#2d6a4f",
    year: "Since 2024",
    desc: "Short-term skill courses (3–6 months) in plumbing, electrical work, tailoring, beautician services, and mobile repair — equipping youth with market-ready skills for livelihood.",
    outcomes: [
      "350 youth trained across 6 vocational tracks",
      "78% of graduates secured employment within 3 months",
      "Avg. starting salary of Rs. 12,000/month for graduates",
    ],
  },
  {
    icon: "👩‍🏫",
    title: "Teacher Training Program",
    status: "Completed",
    statusColor: "#e67e22",
    year: "2022 – 2023",
    desc: "A 6-month certified training program for government school teachers in child-centred teaching methods, classroom management, and technology-aided learning.",
    outcomes: [
      "80 government school teachers trained",
      "Trained teachers serve over 4,000 students",
      "Program adopted by 3 District Education Offices",
    ],
  },
  {
    icon: "📚",
    title: "Mobile Library",
    status: "Completed",
    statusColor: "#e67e22",
    year: "2022 – 2024",
    desc: "A van converted into a mobile library visited 8 villages weekly, providing access to 2,000+ books, magazines, and educational materials for children and adults alike.",
    outcomes: [
      "8 villages served weekly for 2 years",
      "4,500 unique borrowers registered",
      "Reading scores among children improved by 40%",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Scholarship Recipient, Class 12",
    quote: "Because of the True Life scholarship, I did not have to drop out when my father lost his job. Today I am preparing for engineering entrance exams. I owe my future to this foundation.",
    avatar: "👩‍🎓",
  },
  {
    name: "Ramesh Kumar",
    role: "Vocational Training Graduate",
    quote: "I learned electrical work at the training centre and now run my own small business. I earn more than my father ever did as a farm labourer. My children will go to college.",
    avatar: "👨‍🔧",
  },
  {
    name: "Sunita Devi",
    role: "Parent, Village Panchayat Member",
    quote: "When the tutoring centre opened in our village, I was sceptical. Now my daughter tops her class. The teachers genuinely care. We never had this kind of support before.",
    avatar: "👩‍👧",
  },
];

function EducationPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="wp-page">

      <div className="wp-hero wp-hero--edu">
        <div className="wp-hero__overlay" />
        <div className="wp-hero__content">
          <Link to="/" className="wp-back">← Back to Home</Link>
          <div className="wp-hero__badge wp-hero__badge--edu">📚 Education Initiative</div>
          <h1 className="wp-hero__title">Unlocking Potential<br />Through Learning</h1>
          <p className="wp-hero__subtitle">
            We believe education is the single most powerful lever for breaking
            the cycle of poverty. Since 2020, our programs have transformed
            hundreds of young lives across rural India.
          </p>
        </div>
      </div>

      <div className="wp-statsbar wp-statsbar--edu">
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
            <h2 className="section-title">Why Education Comes First</h2>
            <p className="wp-body">
              When True Life Foundation was founded in 2020, one fact was undeniable: in the
              communities we serve, a child's education is constantly at risk — from financial
              pressure, a lack of quality teachers, and the absence of any learning infrastructure
              beyond a crumbling government school.
            </p>
            <p className="wp-body">
              We started with a single tutoring centre in one village and 12 students. Five years
              later, we run 6 distinct education programs, serve 500+ students annually, and have
              seen what genuine, sustained educational support can do — it changes the entire
              trajectory of a family.
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
                      <span className="wp-check wp-check--edu">✔</span>
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-section wp-section--dark" style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f,#40916c)" }}>
        <div className="container">
          <span className="section-label section-label--light">Voices</span>
          <h2 className="section-title" style={{ color: "#fff", marginTop: "14px" }}>Stories of Change</h2>
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
          <h2 className="section-title">Support a Child's Education</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 36px" }}>
            Rs. 5,000 funds one month of tutoring for 10 children. Rs. 20,000 covers
            a full year's scholarship for one student. Every contribution matters.
          </p>
          <div className="wp-cta-btns">
            <Link to="/#donate"     className="btn btn--green">Donate Now</Link>
            <Link to="/work/health" className="btn btn--outline-green">Next: Health Awareness →</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default EducationPage;