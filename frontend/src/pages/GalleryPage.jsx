import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

/** Extract a YouTube/Vimeo embed URL from a normal share link. */
function embedUrl(url = "") {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url; // fall back to whatever was given
}

const FILTERS = [
  { value: "", label: "All" },
  { value: "education", label: "📚 Education" },
  { value: "health", label: "🏥 Health" },
  { value: "welfare", label: "🤝 Welfare" },
  { value: "general", label: "🌱 General" },
];

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // photo item being viewed
  const [filter, setFilter] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Gallery — True Life Foundation";
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getGallery(filter)
      .then((r) => setItems(r.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf9" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#14532d,#2d6a4f 60%,#52b788)", color: "#fff", padding: "72px 24px 56px", textAlign: "center" }}>
        <Link to="/" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 14 }}>← Back to Home</Link>
        <h1 style={{ fontSize: 40, margin: "16px 0 10px" }}>Our Work in Pictures</h1>
        <p style={{ maxWidth: 620, margin: "0 auto", color: "rgba(255,255,255,.9)", lineHeight: 1.6 }}>
          A look at our programmes on the ground — the people, the moments, and the
          impact your support makes possible.
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* Programme filter */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 18px", borderRadius: 999, cursor: "pointer", fontWeight: 600,
                border: "1px solid " + (filter === f.value ? "#16a34a" : "#d1d5db"),
                background: filter === f.value ? "#16a34a" : "#fff",
                color: filter === f.value ? "#fff" : "#374151",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p style={{ textAlign: "center", color: "#6b7280" }}>Loading…</p>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b7280", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
            <p>Photos and videos from our programmes will appear here soon.</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {items.map((it) => (
            <div key={it._id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.07)" }}>
              {it.type === "video" ? (
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    src={embedUrl(it.videoUrl)}
                    title={it.title || "Video"}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <button
                  onClick={() => setLightbox(it)}
                  style={{ display: "block", width: "100%", border: 0, padding: 0, cursor: "pointer", background: "#eee" }}
                >
                  <img src={it.imageUrl} alt={it.title || "Photo"} loading="lazy" decoding="async" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                </button>
              )}
              {(it.title || it.caption) && (
                <div style={{ padding: "14px 16px" }}>
                  {it.title && <h3 style={{ margin: "0 0 4px", fontSize: 17, color: "#14532d" }}>{it.title}</h3>}
                  {it.caption && <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{it.caption}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox for photos */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", display: "grid", placeItems: "center", padding: 24, zIndex: 100, cursor: "zoom-out" }}
        >
          <div style={{ maxWidth: 900, textAlign: "center" }}>
            <img src={lightbox.imageUrl} alt={lightbox.title || ""} style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 10 }} />
            {lightbox.title && <p style={{ color: "#fff", marginTop: 12, fontSize: 18 }}>{lightbox.title}</p>}
            {lightbox.caption && <p style={{ color: "rgba(255,255,255,.75)", margin: "4px 0 0" }}>{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
