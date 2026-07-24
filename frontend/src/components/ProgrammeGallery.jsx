import { useEffect, useState } from "react";
import { api } from "../services/api";

/** Extract a YouTube/Vimeo embed URL from a normal share link. */
function embedUrl(url = "") {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

/**
 * Shows photos + videos for one programme (category), fetched from the backend.
 * Renders nothing if there's no media yet, so pages stay clean until you add some.
 *
 * Props: category ("education" | "health" | "welfare" | "general"),
 *        accent (hex colour for headings), title (section heading).
 */
export default function ProgrammeGallery({ category, accent = "#2d6a4f", title = "From the Field" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let alive = true;
    api.getGallery(category)
      .then((r) => { if (alive) setItems(r.items || []); })
      .catch(() => { if (alive) setItems([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category]);

  if (loading || items.length === 0) return null; // hide until there's media

  return (
    <section className="wp-section wp-section--tinted">
      <div className="container">
        <span className="section-label">Gallery</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle" style={{ margin: "0 auto 36px" }}>
          Real moments from this programme on the ground.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
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
                  <img src={it.imageUrl} alt={it.title || "Photo"} loading="lazy" decoding="async" style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }} />
                </button>
              )}
              {(it.title || it.caption) && (
                <div style={{ padding: "13px 15px" }}>
                  {it.title && <h3 style={{ margin: "0 0 4px", fontSize: 16, color: accent }}>{it.title}</h3>}
                  {it.caption && <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{it.caption}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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
    </section>
  );
}
