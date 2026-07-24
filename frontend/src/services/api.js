/**
 * Tiny API client for the True Life backend.
 * Base URL comes from VITE_API_URL (set in .env), defaulting to localhost.
 */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
}

/** Upload a CV file (multipart) for an existing volunteer application. */
async function uploadVolunteerCV(id, file) {
  const fd = new FormData();
  fd.append("cv", file);
  const res = await fetch(`${BASE}/volunteers/${id}/cv`, { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "CV upload failed");
  return data;
}

/** Download a volunteer's CV (admin only). Triggers a browser download. */
async function downloadVolunteerCV(token, id, fallbackName = "cv") {
  const res = await fetch(`${BASE}/admin/volunteers/${id}/cv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Could not download CV");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fallbackName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Add a gallery photo (multipart) — admin only. */
async function addGalleryPhoto(token, { file, title, caption, category }) {
  const fd = new FormData();
  fd.append("image", file);
  fd.append("title", title || "");
  fd.append("caption", caption || "");
  fd.append("category", category || "general");
  const res = await fetch(`${BASE}/gallery`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Upload failed");
  return data;
}

export const api = {
  sendContact: (payload) => request("/contact", { method: "POST", body: payload }),
  submitVolunteer: (payload) => request("/volunteers", { method: "POST", body: payload }),
  uploadVolunteerCV,
  downloadVolunteerCV,

  // ─── Gallery ───
  getGallery: (category) => request(`/gallery${category ? `?category=${category}` : ""}`),
  addGalleryPhoto,
  addGalleryVideo: (token, payload) => request("/gallery", { method: "POST", body: { type: "video", ...payload }, token }),
  deleteGalleryItem: (token, id) => request(`/gallery/${id}`, { method: "DELETE", token }),
  donationConfig: () => request("/donations/config"),
  createOrder: (payload) => request("/donations/order", { method: "POST", body: payload }),
  verifyPayment: (payload) => request("/donations/verify", { method: "POST", body: payload }),

  // ─── Admin (all require a token except login) ───
  adminLogin: (payload) => request("/admin/login", { method: "POST", body: payload }),
  adminStats: (token) => request("/admin/stats", { token }),
  adminContacts: (token, page = 1) => request(`/admin/contacts?page=${page}&limit=50`, { token }),
  adminVolunteers: (token, page = 1, status = "") =>
    request(`/admin/volunteers?page=${page}&limit=50${status ? `&status=${status}` : ""}`, { token }),
  adminUpdateVolunteer: (token, id, status) =>
    request(`/admin/volunteers/${id}`, { method: "PATCH", body: { status }, token }),
  adminDonations: (token, page = 1) => request(`/admin/donations?page=${page}&limit=50`, { token }),
};

export default api;
