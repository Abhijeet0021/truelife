import { useState, useEffect, useRef } from "react";

const STATS = [
  { value: 350, label: "Lives Touched",        suffix: "+" },
  { value: 15,   label: "Projects Completed",   suffix: "+" },
  { value: 3,    label: "Years of Service",      suffix: ""  },
  { value: 12,   label: "Communities Served",   suffix: "+" },
];

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, active]);

  return count;
}

function StatCard({ value, label, suffix, animate }) {
  const count = useCountUp(value, 1800, animate);

  return (
    <div className="stat-card">
      <div className="stat-card__number">
        {count}{suffix}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function Impact() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="impact" id="impact" ref={ref}>
      <div className="container">
        <span className="section-label section-label--light">Our Impact</span>
        <h2 className="section-title section-title--light" style={{ marginTop: "16px" }}>
          Numbers That Matter
        </h2>
        <p className="section-subtitle section-subtitle--light">
          Every contribution, every volunteer hour, every program we run —
          it all adds up to real change in real lives.
        </p>

        <div className="impact__stats-grid">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} animate={visible} />
          ))}
        </div>

        <p className="impact__quote">
          "Through your support, we've achieved significant milestones.
          Every contribution makes a difference."
        </p>
      </div>
    </section>
  );
}

export default Impact;
