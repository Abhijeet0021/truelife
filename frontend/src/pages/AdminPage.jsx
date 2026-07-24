import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import AdminCharts from "../components/AdminCharts";

/* Keep the login token across refreshes. */
const TOKEN_KEY = "tl_admin_token";
const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const VOLUNTEER_STATUSES = ["new", "reviewing", "contacted", "onboarded", "rejected"];

const styles = {
  page: { minHeight: "100vh", background: "#f1f5f4", color: "#1f2937", fontFamily: "system-ui, sans-serif" },
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 28px", background: "#14532d", color: "#fff",
  },
  wrap: { maxWidth: 1100, margin: "0 auto", padding: "28px" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 },
  card: { background: "#fff", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,.08)" },
  cardNum: { fontSize: 30, fontWeight: 700, color: "#16a34a" },
  cardLbl: { color: "#6b7280", fontSize: 14, marginTop: 4 },
  tabs: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  tab: (on) => ({
    padding: "8px 18px", borderRadius: 999, border: "1px solid #d1d5db", cursor: "pointer",
    background: on ? "#16a34a" : "#fff", color: on ? "#fff" : "#374151", fontWeight: 600,
  }),
  panel: { background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.08)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "12px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontWeight: 600, whiteSpace: "nowrap" },
  td: { padding: "12px 14px", borderBottom: "1px solid #f3f4f6", verticalAlign: "top" },
  empty: { padding: 40, textAlign: "center", color: "#9ca3af" },
  btn: { padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 },
  select: { padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff" },
};

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/** Turn an array of objects into a CSV file and trigger a download. */
function downloadCSV(filename, columns, rows) {
  const esc = (v) => {
    const s = v == null ? "" : Array.isArray(v) ? v.join("; ") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => esc(c.label)).join(",");
  const body = rows.map((r) => columns.map((c) => esc(c.get(r))).join(",")).join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/** Case-insensitive "does any field contain the query" filter. */
function matches(obj, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return JSON.stringify(obj).toLowerCase().includes(needle);
}

/* ─── Login screen ─── */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await api.adminLogin({ email, password });
      setToken(res.token);
      onLogin(res.token);
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ ...styles.page, display: "grid", placeItems: "center" }}>
      <form onSubmit={submit} style={{ ...styles.card, width: 360 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>True Life Admin</h1>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: 14 }}>Sign in to view submissions</p>

        <label style={{ fontSize: 13, fontWeight: 600 }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", padding: 10, margin: "6px 0 14px", borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }} />

        <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: "100%", padding: 10, margin: "6px 0 14px", borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box" }} />

        {err && <p style={{ color: "#dc2626", fontSize: 13, margin: "0 0 12px" }}>⚠ {err}</p>}

        <button type="submit" disabled={busy}
          style={{ ...styles.btn, width: "100%", background: "#16a34a", color: "#fff" }}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState("contacts");
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [s, c, v, d, g] = await Promise.all([
        api.adminStats(token),
        api.adminContacts(token),
        api.adminVolunteers(token),
        api.adminDonations(token),
        api.getGallery(),
      ]);
      setStats(s.stats);
      setContacts(c.items);
      setVolunteers(v.items);
      setDonations(d.items);
      setGallery(g.items);
    } catch (e) {
      // An expired/invalid token means we should bounce to login.
      if (/token|auth/i.test(e.message)) return onLogout();
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await api.adminUpdateVolunteer(token, id, status);
      setVolunteers((vs) => vs.map((v) => (v._id === id ? { ...v, status } : v)));
    } catch (e) {
      alert(e.message);
    }
  };

  const getCV = async (v) => {
    try {
      await api.downloadVolunteerCV(token, v._id, v.cvName || "cv");
    } catch (e) {
      alert(e.message);
    }
  };

  // Filtered views for the active search query.
  const fContacts = contacts.filter((x) => matches(x, q));
  const fVolunteers = volunteers.filter((x) => matches(x, q));
  const fDonations = donations.filter((x) => matches(x, q));

  const exportCSV = () => {
    if (tab === "contacts") {
      downloadCSV("contacts.csv", [
        { label: "Date", get: (r) => fmtDate(r.createdAt) },
        { label: "Name", get: (r) => r.name },
        { label: "Email", get: (r) => r.email },
        { label: "Message", get: (r) => r.message },
      ], fContacts);
    } else if (tab === "volunteers") {
      downloadCSV("volunteers.csv", [
        { label: "Date", get: (r) => fmtDate(r.createdAt) },
        { label: "Name", get: (r) => `${r.firstName} ${r.lastName}` },
        { label: "Email", get: (r) => r.email },
        { label: "Phone", get: (r) => r.phone },
        { label: "District", get: (r) => r.district },
        { label: "Skills", get: (r) => r.skills },
        { label: "Languages", get: (r) => r.languages },
        { label: "Experience", get: (r) => r.experience },
        { label: "Status", get: (r) => r.status },
        { label: "Motivation", get: (r) => r.motivation },
      ], fVolunteers);
    } else {
      downloadCSV("donations.csv", [
        { label: "Date", get: (r) => fmtDate(r.createdAt) },
        { label: "Receipt", get: (r) => r.receiptNo },
        { label: "Amount (INR)", get: (r) => r.amount / 100 },
        { label: "Donor", get: (r) => r.name },
        { label: "Email", get: (r) => r.email },
        { label: "Status", get: (r) => r.status },
        { label: "Payment ID", get: (r) => r.paymentId },
      ], fDonations);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bar}>
        <strong>🌱 True Life — Admin Dashboard</strong>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={load} style={{ ...styles.btn, background: "#22c55e", color: "#fff" }}>↻ Refresh</button>
          <button onClick={onLogout} style={{ ...styles.btn, background: "rgba(255,255,255,.15)", color: "#fff" }}>Log out</button>
        </div>
      </div>

      <div style={styles.wrap}>
        {/* Stat cards */}
        <div style={styles.cards}>
          <div style={styles.card}><div style={styles.cardNum}>{stats?.contacts ?? "…"}</div><div style={styles.cardLbl}>Contact messages</div></div>
          <div style={styles.card}><div style={styles.cardNum}>{stats?.volunteers ?? "…"}</div><div style={styles.cardLbl}>Volunteer applications</div></div>
          <div style={styles.card}><div style={styles.cardNum}>{stats?.donationsPaid ?? "…"}</div><div style={styles.cardLbl}>Paid donations</div></div>
          <div style={styles.card}><div style={styles.cardNum}>₹{(stats?.totalRaisedInr ?? 0).toLocaleString("en-IN")}</div><div style={styles.cardLbl}>Total raised</div></div>
        </div>

        {/* Charts */}
        {!loading && <AdminCharts contacts={contacts} volunteers={volunteers} donations={donations} />}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={styles.tab(tab === "contacts")} onClick={() => setTab("contacts")}>Contacts ({contacts.length})</button>
          <button style={styles.tab(tab === "volunteers")} onClick={() => setTab("volunteers")}>Volunteers ({volunteers.length})</button>
          <button style={styles.tab(tab === "donations")} onClick={() => setTab("donations")}>Donations ({donations.length})</button>
          <button style={styles.tab(tab === "gallery")} onClick={() => setTab("gallery")}>Gallery ({gallery.length})</button>
        </div>

        {/* Search + export toolbar (data tabs only) */}
        {tab !== "gallery" && (
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <input
              placeholder="🔍 Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db" }}
            />
            <button onClick={exportCSV} style={{ ...styles.btn, background: "#0f766e", color: "#fff" }}>
              ⬇ Export CSV
            </button>
          </div>
        )}

        {err && <p style={{ color: "#dc2626" }}>⚠ {err}</p>}
        {loading && <p style={{ color: "#6b7280" }}>Loading…</p>}

        {/* Contacts */}
        {!loading && tab === "contacts" && (
          <div style={styles.panel}>
            <table style={styles.table}>
              <thead><tr>
                <th style={styles.th}>Date</th><th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th><th style={styles.th}>Message</th>
              </tr></thead>
              <tbody>
                {fContacts.length === 0 && <tr><td style={styles.empty} colSpan={4}>No messages found</td></tr>}
                {fContacts.map((c) => (
                  <tr key={c._id}>
                    <td style={styles.td}>{fmtDate(c.createdAt)}</td>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}><a href={`mailto:${c.email}`}>{c.email}</a></td>
                    <td style={{ ...styles.td, maxWidth: 380 }}>{c.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Volunteers */}
        {!loading && tab === "volunteers" && (
          <div style={styles.panel}>
            <table style={styles.table}>
              <thead><tr>
                <th style={styles.th}>Date</th><th style={styles.th}>Name</th><th style={styles.th}>Contact</th>
                <th style={styles.th}>District</th><th style={styles.th}>Skills</th>
                <th style={styles.th}>CV</th><th style={styles.th}>Status</th>
              </tr></thead>
              <tbody>
                {fVolunteers.length === 0 && <tr><td style={styles.empty} colSpan={7}>No applications found</td></tr>}
                {fVolunteers.map((v) => (
                  <tr key={v._id}>
                    <td style={styles.td}>{fmtDate(v.createdAt)}</td>
                    <td style={styles.td}>{v.firstName} {v.lastName}</td>
                    <td style={styles.td}>
                      <a href={`mailto:${v.email}`}>{v.email}</a><br />
                      <span style={{ color: "#6b7280" }}>+91 {v.phone}</span>
                    </td>
                    <td style={styles.td}>{v.district || "—"}</td>
                    <td style={{ ...styles.td, maxWidth: 220 }}>{(v.skills || []).join(", ")}</td>
                    <td style={styles.td}>
                      {v.cvName
                        ? <button onClick={() => getCV(v)} style={{ ...styles.btn, padding: "6px 12px", background: "#16a34a", color: "#fff", fontSize: 13 }}>⬇ CV</button>
                        : <span style={{ color: "#9ca3af" }}>—</span>}
                    </td>
                    <td style={styles.td}>
                      <select style={styles.select} value={v.status} onChange={(e) => changeStatus(v._id, e.target.value)}>
                        {VOLUNTEER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Donations */}
        {!loading && tab === "donations" && (
          <div style={styles.panel}>
            <table style={styles.table}>
              <thead><tr>
                <th style={styles.th}>Date</th><th style={styles.th}>Receipt</th><th style={styles.th}>Amount</th>
                <th style={styles.th}>Donor</th><th style={styles.th}>Status</th><th style={styles.th}>Payment ID</th>
              </tr></thead>
              <tbody>
                {fDonations.length === 0 && <tr><td style={styles.empty} colSpan={6}>No donations found</td></tr>}
                {fDonations.map((d) => (
                  <tr key={d._id}>
                    <td style={styles.td}>{fmtDate(d.createdAt)}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 12 }}>{d.receiptNo || "—"}</td>
                    <td style={styles.td}>₹{(d.amount / 100).toLocaleString("en-IN")}</td>
                    <td style={styles.td}>{d.name || "—"}<br /><span style={{ color: "#6b7280" }}>{d.email || ""}</span></td>
                    <td style={styles.td}>
                      <span style={{
                        padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                        background: d.status === "paid" ? "#dcfce7" : d.status === "failed" ? "#fee2e2" : "#fef9c3",
                        color: d.status === "paid" ? "#166534" : d.status === "failed" ? "#991b1b" : "#854d0e",
                      }}>{d.status}</span>
                    </td>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 12 }}>{d.paymentId || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Gallery */}
        {!loading && tab === "gallery" && (
          <GalleryManager token={token} items={gallery} onChange={load} onExpired={onLogout} />
        )}
      </div>
    </div>
  );
}

/* ─── Gallery manager (admin) ─── */
const GALLERY_CATEGORIES = [
  { value: "education", label: "📚 Education" },
  { value: "health", label: "🏥 Health" },
  { value: "welfare", label: "🤝 Social Welfare" },
  { value: "general", label: "🌱 General" },
];

function GalleryManager({ token, items, onChange, onExpired }) {
  const [mode, setMode] = useState("photo"); // "photo" | "video"
  const [category, setCategory] = useState("education");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const reset = () => { setFile(null); setVideoUrl(""); setTitle(""); setCaption(""); };

  const add = async () => {
    setErr("");
    setBusy(true);
    try {
      if (mode === "photo") {
        if (!file) throw new Error("Please choose an image.");
        await api.addGalleryPhoto(token, { file, title, caption, category });
      } else {
        if (!videoUrl.trim()) throw new Error("Please paste a YouTube/Vimeo link.");
        await api.addGalleryVideo(token, { title, caption, videoUrl, category });
      }
      reset();
      onChange();
    } catch (e) {
      if (/token|auth/i.test(e.message)) return onExpired();
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.deleteGalleryItem(token, id);
      onChange();
    } catch (e) {
      alert(e.message);
    }
  };

  const inp = { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" };

  return (
    <div>
      {/* Upload form */}
      <div style={{ ...styles.panel, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button style={styles.tab(mode === "photo")} onClick={() => setMode("photo")}>📷 Photo</button>
          <button style={styles.tab(mode === "video")} onClick={() => setMode("video")}>🎬 YouTube video</button>
        </div>

        <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Programme</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inp}>
            {GALLERY_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {mode === "photo" ? (
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={inp} />
          ) : (
            <input placeholder="Paste YouTube or Vimeo link" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={inp} />
          )}
          <input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} style={inp} />
          <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} style={inp} />
          {err && <p style={{ color: "#dc2626", margin: 0 }}>⚠ {err}</p>}
          <button onClick={add} disabled={busy} style={{ ...styles.btn, background: "#16a34a", color: "#fff", width: "fit-content" }}>
            {busy ? "Adding…" : "＋ Add to gallery"}
          </button>
        </div>
      </div>

      {/* Existing items */}
      {items.length === 0 ? (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: 30 }}>No gallery items yet. Add your first above.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {items.map((it) => (
            <div key={it._id} style={{ ...styles.panel, overflow: "hidden" }}>
              {it.type === "video" ? (
                <div style={{ background: "#eef2f1", padding: "28px 12px", textAlign: "center", fontSize: 13, color: "#6b7280" }}>
                  🎬 Video<br /><span style={{ fontSize: 11 }}>{it.videoUrl}</span>
                </div>
              ) : (
                <img src={it.imageUrl} alt={it.title || ""} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 11, color: "#0f766e", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>{it.category || "general"}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{it.title || "(untitled)"}</div>
                <button onClick={() => remove(it._id)} style={{ ...styles.btn, padding: "6px 12px", background: "#fee2e2", color: "#991b1b", fontSize: 13 }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Entry ─── */
export default function AdminPage() {
  const [token, setTok] = useState(getToken());

  useEffect(() => { document.title = "True Life — Admin"; }, []);

  const handleLogout = () => { clearToken(); setTok(null); };

  if (!token) return <Login onLogin={setTok} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
