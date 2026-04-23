import { Link } from "react-router-dom";
import LOGO_SRC from "../assets/logo.js";

function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase().replace(" ", "-"));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">

          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" style={{ textDecoration: "none" }}>
              <img src={LOGO_SRC} alt="True Life Foundation" className="footer__logo-img" />
              <span className="footer__logo-text">True Life Foundation</span>
            </Link>
            <p className="footer__tagline">
              Empowering communities, building futures — one life at a time.
            </p>
          </div>

          {/* Home sections */}
          <div>
            <p className="footer__col-title">Quick Links</p>
            {["About", "Our Work", "Impact", "Donate", "Contact"].map((link) => (
              <button key={link} className="footer__link" onClick={() => scrollTo(link)}>
                {link}
              </button>
            ))}
          </div>

          {/* Pages */}
          <div>
            <p className="footer__col-title">Get Involved</p>
            <Link to="/volunteer" className="footer__link" style={{ display:"block", textDecoration:"none" }}>Volunteer</Link>
            <Link to="/work/education" className="footer__link" style={{ display:"block", textDecoration:"none" }}>Education</Link>
            <Link to="/work/health"    className="footer__link" style={{ display:"block", textDecoration:"none" }}>Health</Link>
            <Link to="/work/welfare"   className="footer__link" style={{ display:"block", textDecoration:"none" }}>Welfare</Link>
          </div>

          {/* Legal */}
          <div>
            <p className="footer__col-title">Legal</p>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <button key={item} className="footer__link">{item}</button>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2022 True Life Foundation. All rights reserved.</p>
          <p>Made with 💚 for a better world. Abhijeet Kumar</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
