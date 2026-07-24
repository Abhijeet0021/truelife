import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Homepage + chrome load eagerly (needed immediately on first paint).
import Header       from "./components/Header";
import Hero         from "./components/Hero";
import About        from "./components/About";
import OurWork      from "./components/OurWork";
import Impact       from "./components/Impact";
import HomeGallery  from "./components/HomeGallery";
import Donate       from "./components/Donate";
import Contact      from "./components/Contact";
import Footer       from "./components/Footer";
import ScrollToTop  from "./components/ScrollToTop";

// Secondary pages are code-split — they download only when visited,
// which keeps the initial homepage bundle small and fast.
const VisionPage    = lazy(() => import("./pages/VisionPage"));
const MissionPage   = lazy(() => import("./pages/MissionPage"));
const ApproachPage  = lazy(() => import("./pages/ApproachPage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const HealthPage    = lazy(() => import("./pages/HealthPage"));
const WelfarePage   = lazy(() => import("./pages/WelfarePage"));
const NotFoundPage  = lazy(() => import("./pages/NotFoundPage"));
const VolunteerPage = lazy(() => import("./pages/VolunteerPage"));
const AdminPage     = lazy(() => import("./pages/AdminPage"));
const GalleryPage   = lazy(() => import("./pages/GalleryPage"));

function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "#6b7280" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 34, height: 34, margin: "0 auto 12px", borderRadius: "50%",
          border: "3px solid #d1fae5", borderTopColor: "#16a34a",
          animation: "tl-spin 0.8s linear infinite",
        }} />
        Loading…
        <style>{`@keyframes tl-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero /><About /><OurWork /><Impact /><HomeGallery /><Donate /><Contact />
    </>
  );
}

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function NotFoundLayout() {
  return (
    <>
      <Header />
      <main><NotFoundPage /></main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"               element={<Layout><HomePage      /></Layout>} />
          <Route path="/vision"         element={<Layout><VisionPage    /></Layout>} />
          <Route path="/mission"        element={<Layout><MissionPage   /></Layout>} />
          <Route path="/approach"       element={<Layout><ApproachPage  /></Layout>} />
          <Route path="/work/education" element={<Layout><EducationPage /></Layout>} />
          <Route path="/work/health"    element={<Layout><HealthPage    /></Layout>} />
          <Route path="/work/welfare"   element={<Layout><WelfarePage   /></Layout>} />
          <Route path="/volunteer"      element={<Layout><VolunteerPage /></Layout>} />
          <Route path="/gallery"        element={<Layout><GalleryPage   /></Layout>} />
          <Route path="/admin"          element={<AdminPage />} />
          <Route path="*"               element={<NotFoundLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
