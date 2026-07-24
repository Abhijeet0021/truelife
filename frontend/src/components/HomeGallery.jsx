import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

/** YouTube/Vimeo thumbnail for video items (so the strip stays lightweight). */
function videoThumb(url = "") {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

/**
 * A preview strip of the most recent gallery photos/videos on the homepage.
 * Builds trust by showing real work. Hidden entirely until media exists.
 */
export default function HomeGallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    api.getGallery()
      .then((r) => { if (alive) setItems((r.items || []).slice(0, 6)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="work" style={{ background: "#f8faf9" }}>
      <div className="container">
        <span className="section-label">See It For Yourself</span>
        <h2 className="section-title">Moments From Our Work</h2>
        <p className="section-subtitle">
          Real photos and videos from our programmes on the ground — because
          trust is built by showing, not just telling.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          {items.map((it) => {
            const src = it.type === "video" ? videoThumb(it.videoUrl) : it.imageUrl;
            return (
              <Link
                key={it._id}
                to="/gallery"
                style={{
                  position: "relative", borderRadius: 14, overflow: "hidden",
                  aspectRatio: "4 / 3", background: "#e5e7eb", display: "block",
                  boxShadow: "0 2px 10px rgba(0,0,0,.07)",
                }}
              >
                {src && (
                  <img
                    src={src}
                    alt={it.title || "Programme photo"}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                )}
                {it.type === "video" && (
                  <span
                    style={{
                      position: "absolute", inset: 0, display: "grid", placeItems: "center",
                      background: "rgba(0,0,0,.28)", color: "#fff", fontSize: 34,
                    }}
                  >
                    ▶
                  </span>
                )}
                {it.title && (
                  <span
                    style={{
                      position: "absolute", left: 0, right: 0, bottom: 0,
                      padding: "18px 12px 10px", color: "#fff", fontSize: 13, fontWeight: 600,
                      background: "linear-gradient(transparent, rgba(0,0,0,.65))",
                    }}
                  >
                    {it.title}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/gallery" className="btn btn--green">View Full Gallery →</Link>
        </div>
      </div>
    </section>
  );
}
