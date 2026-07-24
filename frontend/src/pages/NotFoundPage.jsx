import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const QUICK_LINKS = [
  { label: "Home",              path: "/",              icon: "🏠" },
  { label: "About Us",          path: "/#about",        icon: "💚" },
  { label: "Our Work",          path: "/#our-work",     icon: "🌍" },
  { label: "Education",         path: "/work/education",icon: "📚" },
  { label: "Health Awareness",  path: "/work/health",   icon: "🏥" },
  { label: "Social Welfare",    path: "/work/welfare",  icon: "🤝" },
  { label: "Our Team",          path: "/team",          icon: "👥" },
  { label: "Donate",            path: "/#donate",       icon: "🎁" },
  { label: "Contact Us",        path: "/#contact",      icon: "✉️" },
];

export default function NotFoundPage() {
  const navigate  = useNavigate();
  const [count, setCount] = useState(10);

  /* auto-redirect countdown */
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(timer); navigate("/"); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="nf-page">

      {/* ── Main Card ── */}
      <div className="nf-card">

        {/* Animated 404 */}
        <div className="nf-code">
          <span className="nf-code__4 nf-code__4--left">4</span>
          <div className="nf-code__globe">🌍</div>
          <span className="nf-code__4 nf-code__4--right">4</span>
        </div>

        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-body">
          Looks like this page wandered off into the field. It may have been
          moved, renamed, or never existed — but our work certainly does.
        </p>

        {/* Countdown */}
        <div className="nf-countdown">
          <div className="nf-countdown__ring">
            <span className="nf-countdown__num">{count}</span>
          </div>
          <p className="nf-countdown__text">
            Redirecting you home in <strong>{count}</strong> second{count !== 1 ? "s" : ""}…
          </p>
        </div>

        {/* Primary actions */}
        <div className="nf-btns">
          <Link to="/" className="btn btn--green">🏠 Go Home Now</Link>
          <Link to="/#donate" className="btn btn--outline-green">💚 Make a Donation</Link>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="nf-links-section">
        <h2 className="nf-links-title">Or go directly to:</h2>
        <div className="nf-links-grid">
          {QUICK_LINKS.map((l) => (
            <Link key={l.label} to={l.path} className="nf-link-card">
              <span className="nf-link-card__icon">{l.icon}</span>
              <span className="nf-link-card__label">{l.label}</span>
              <span className="nf-link-card__arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Fun fact ── */}
      <div className="nf-fact">
        <p>
          While you're here —{" "}
          <strong>500+ students</strong> are supported by our Education Initiative right now.{" "}
          <Link to="/#donate" className="nf-fact__link">Your donation can add to that number.</Link>
        </p>
      </div>

    </div>
  );
}
