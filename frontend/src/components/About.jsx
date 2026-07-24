import { Link } from "react-router-dom";

const VALUES = [
  { icon: "🌿", name: "Integrity" },
  { icon: "💚", name: "Compassion" },
  { icon: "🤲", name: "Collaboration" },
  { icon: "♻️", name: "Sustainability" },
  { icon: "✨", name: "Empowerment" },
];

const ABOUT_CARDS = [
  {
    icon: "🌅",
    title: "Our Vision",
    body: "A world where every individual has the opportunity to lead a healthy, educated, and dignified life — regardless of circumstance.",
    link: "/vision",
    color: "#2d6a4f",
  },
  {
    icon: "🎯",
    title: "Our Mission",
    body: "To empower underprivileged communities through education, skill development, and health awareness — providing sustainable support that fosters self-reliance.",
    link: "/mission",
    color: "#40916c",
  },
  {
    icon: "💡",
    title: "Our Approach",
    body: "We believe in community-driven solutions — working alongside the people we serve to design programs that create real, measurable, lasting impact.",
    link: "/approach",
    color: "#52b788",
  },
];

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <span className="section-label">Who We Are</span>
        <h2 className="section-title">About Our Foundation</h2>
        <p className="section-subtitle">
          True Life Foundation is dedicated to empowering individuals and
          communities to live better, healthier, and more fulfilling lives.
          We focus on holistic development — supporting education, health, and
          social welfare to create lasting positive change.
        </p>

        {/* Values */}
        <div className="values-row">
          {VALUES.map((v) => (
            <div key={v.name} className="value-pill">
              <span>{v.icon}</span>
              {v.name}
            </div>
          ))}
        </div>

        {/* Cards — clicking navigates to detail page */}
        <div className="about__grid">
          {ABOUT_CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="card about-card-link"
              style={{ "--card-accent": card.color }}
            >
              <div className="card__icon">{card.icon}</div>
              <h3 className="card__title">{card.title}</h3>
              <p className="card__body">{card.body}</p>
              <span className="card__cta">Read More →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;