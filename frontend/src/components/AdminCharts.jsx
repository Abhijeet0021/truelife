/**
 * Lightweight, dependency-free charts for the admin dashboard.
 * Pure SVG — no chart library needed, so nothing extra to install.
 */

const GREEN = "#16a34a";
const TEAL = "#0f766e";

function monthKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-");
  return new Date(y, m - 1).toLocaleString("en-IN", { month: "short" });
}

/** Vertical bar chart from [{ label, value }]. */
function BarChart({ data, color = GREEN, prefix = "", height = 160 }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / (data.length * 1.6);
  const gap = barW * 0.6;

  if (data.length === 0) {
    return <p style={{ color: "#9ca3af", fontSize: 13, padding: "24px 0", textAlign: "center" }}>No data yet</p>;
  }

  return (
    <svg viewBox="0 0 100 60" width="100%" height={height} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const h = (d.value / max) * 44;
        const x = i * (barW + gap) + gap;
        return (
          <g key={i}>
            <rect x={x} y={50 - h} width={barW} height={h} rx="1" fill={color} />
            <text x={x + barW / 2} y={48 - h} textAnchor="middle" fontSize="3" fill="#374151">
              {prefix}{d.value}
            </text>
            <text x={x + barW / 2} y="55" textAnchor="middle" fontSize="3" fill="#6b7280">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const card = {
  background: "#fff", borderRadius: 12, padding: "18px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,.08)", flex: 1, minWidth: 280,
};
const cardTitle = { margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#14532d" };

export default function AdminCharts({ contacts = [], volunteers = [], donations = [] }) {
  // Donations (₹) by month — last 6 months, paid only.
  const paid = donations.filter((d) => d.status === "paid");
  const byMonth = {};
  paid.forEach((d) => {
    const k = monthKey(d.createdAt);
    byMonth[k] = (byMonth[k] || 0) + d.amount / 100;
  });
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(dt);
    months.push({ label: monthLabel(k), value: Math.round(byMonth[k] || 0) });
  }

  // Volunteers by district — top 6.
  const districtCounts = {};
  volunteers.forEach((v) => {
    const key = v.district || "Other";
    districtCounts[key] = (districtCounts[key] || 0) + 1;
  });
  const districts = Object.entries(districtCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Submissions over last 6 months (contacts + volunteers).
  const subsByMonth = {};
  [...contacts, ...volunteers].forEach((x) => {
    const k = monthKey(x.createdAt);
    subsByMonth[k] = (subsByMonth[k] || 0) + 1;
  });
  const subs = [];
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = monthKey(dt);
    subs.push({ label: monthLabel(k), value: subsByMonth[k] || 0 });
  }

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      <div style={card}>
        <h3 style={cardTitle}>💚 Donations (₹) — last 6 months</h3>
        <BarChart data={months} color={GREEN} prefix="₹" />
      </div>
      <div style={card}>
        <h3 style={cardTitle}>🙌 Volunteers by district</h3>
        <BarChart data={districts} color={TEAL} />
      </div>
      <div style={card}>
        <h3 style={cardTitle}>📈 Submissions — last 6 months</h3>
        <BarChart data={subs} color="#7b1fa2" />
      </div>
    </div>
  );
}
