import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct       = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;

      setVisible(scrolled > 300);
      setScrollPct(pct);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* SVG circle progress values */
  const RADIUS      = 20;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset  = CIRCUMFERENCE - (scrollPct / 100) * CIRCUMFERENCE;

  return (
    <button
      className={`stt-btn ${visible ? "stt-btn--visible" : ""}`}
      onClick={goTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      {/* Circular progress ring */}
      <svg className="stt-ring" viewBox="0 0 48 48">
        {/* Background track */}
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="3"
        />
        {/* Progress arc */}
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
      </svg>

      {/* Arrow icon */}
      <span className="stt-arrow">↑</span>
    </button>
  );
}
