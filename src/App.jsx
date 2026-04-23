import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Header       from "./components/Header";
import Hero         from "./components/Hero";
import About        from "./components/About";
import OurWork      from "./components/OurWork";
import Impact       from "./components/Impact";
import Donate       from "./components/Donate";
import Contact      from "./components/Contact";
import Footer       from "./components/Footer";
import ScrollToTop  from "./components/ScrollToTop";

import VisionPage    from "./pages/VisionPage";
import MissionPage   from "./pages/MissionPage";
import ApproachPage  from "./pages/ApproachPage";
import EducationPage from "./pages/EducationPage";
import HealthPage    from "./pages/HealthPage";
import WelfarePage   from "./pages/WelfarePage";
import NotFoundPage   from "./pages/NotFoundPage";
import VolunteerPage  from "./pages/VolunteerPage";

function HomePage() {
  return (
    <>
      <Hero /><About /><OurWork /><Impact /><Donate /><Contact />
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
      <Routes>
        <Route path="/"               element={<Layout><HomePage      /></Layout>} />
        <Route path="/vision"         element={<Layout><VisionPage    /></Layout>} />
        <Route path="/mission"        element={<Layout><MissionPage   /></Layout>} />
        <Route path="/approach"       element={<Layout><ApproachPage  /></Layout>} />
        <Route path="/work/education" element={<Layout><EducationPage /></Layout>} />
        <Route path="/work/health"    element={<Layout><HealthPage    /></Layout>} />
        <Route path="/work/welfare"   element={<Layout><WelfarePage   /></Layout>} />
        <Route path="/volunteer"      element={<Layout><VolunteerPage /></Layout>} />
        <Route path="*"               element={<NotFoundLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
