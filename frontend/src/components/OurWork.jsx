import { Link } from "react-router-dom";

const WORK_ITEMS = [
  {
    id: "education",
    icon: "📚",
    color: "#1e7e5a",
    colorLight: "#e8f5ee",
    gradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%)",
    title: "Education Initiative",
    tagline: "Unlocking potential through learning",
    desc: "Providing quality education, scholarships, and skill-building programs to underprivileged youth across rural communities.",
    path: "/work/education",
    stats: [
      { value: "500+", label: "Students Supported" },
      { value: "12",   label: "Learning Centres"   },
      { value: "85%",  label: "Pass Rate"           },
    ],
    highlights: [
      "Free after-school tutoring in 12 rural villages",
      "Scholarship fund for 120 students",
      "Digital literacy labs with 200+ computers",
      "Vocational training in coding & trades",
    ],
  },
  {
    id: "health",
    icon: "🏥",
    color: "#1565c0",
    colorLight: "#e3f2fd",
    gradient: "linear-gradient(135deg, #0d47a1 0%, #1565c0 60%, #42a5f5 100%)",
    title: "Health Awareness",
    tagline: "Healthy communities, brighter futures",
    desc: "Running health camps, nutrition drives, and mental wellness workshops to improve community health outcomes.",
    path: "/work/health",
    stats: [
      { value: "20+",  label: "Health Camps"      },
      { value: "3K+",  label: "People Screened"   },
      { value: "8",    label: "Partner Hospitals" },
    ],
    highlights: [
      "Monthly mobile health camps in 8 districts",
      "Free medicines for BPL families",
      "Nutrition counselling for 600+ mothers",
      "Mental health workshops in schools",
    ],
  },
  {
    id: "welfare",
    icon: "🤝",
    color: "#7b2d8b",
    colorLight: "#f3e5f5",
    gradient: "linear-gradient(135deg, #4a148c 0%, #7b1fa2 60%, #ba68c8 100%)",
    title: "Social Welfare",
    tagline: "Empowering lives, strengthening communities",
    desc: "Supporting vulnerable families with livelihood programs, women empowerment, and disaster relief efforts.",
    path: "/work/welfare",
    stats: [
      { value: "300+", label: "Women in SHGs"      },
      { value: "150+", label: "Families Supported" },
      { value: "3",    label: "Relief Operations"  },
    ],
    highlights: [
      "Self-Help Groups for 300+ women entrepreneurs",
      "Micro-finance linkages for small businesses",
      "Disaster relief kits for 400+ families",
      "Legal aid for domestic violence survivors",
    ],
  },
];

function WorkCard({ item }) {
  return (
    <Link to={item.path} className="owcard" style={{ "--wc": item.color, "--wc-light": item.colorLight }}>
      {/* Coloured top bar */}
      <div className="owcard__bar" style={{ background: item.gradient }} />

      {/* Icon */}
      <div className="owcard__icon-wrap" style={{ background: item.colorLight }}>
        <span className="owcard__icon">{item.icon}</span>
      </div>

      <h3 className="owcard__title">{item.title}</h3>
      <p className="owcard__tagline">{item.tagline}</p>
      <p className="owcard__desc">{item.desc}</p>

      {/* Quick stats */}
      <div className="owcard__stats">
        {item.stats.map((s) => (
          <div key={s.label} className="owcard__stat">
            <span className="owcard__stat-val" style={{ color: item.color }}>{s.value}</span>
            <span className="owcard__stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Highlights */}
      <ul className="owcard__highlights">
        {item.highlights.map((h, i) => (
          <li key={i} className="owcard__hl">
            <span className="owcard__check" style={{ color: item.color }}>✔</span>
            {h}
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="owcard__footer" style={{ borderColor: item.colorLight }}>
        <span className="owcard__cta" style={{ color: item.color }}>
          View Full Project →
        </span>
      </div>
    </Link>
  );
}

function OurWork() {
  return (
    <section className="work" id="our-work">
      <div className="container">
        <span className="section-label">What We Do</span>
        <h2 className="section-title">Our Work &amp; Projects</h2>
        <p className="section-subtitle">
          From classrooms to clinics, our programs reach the most vulnerable
          and create real pathways to a better life.{" "}
          <strong>Click any card to explore the full project.</strong>
        </p>

        <div className="work__grid">
          {WORK_ITEMS.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurWork;
