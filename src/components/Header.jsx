import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LOGO_SRC from "../assets/logo.js";

const NAV_LINKS = ["About", "Our Work", "Impact", "Donate", "Contact"];

function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* On non-home pages the header is always "scrolled" style */
  const solidHeader = scrolled || !isHome;

  const scrollTo = (id) => {
    const sectionId = id.toLowerCase().replace(" ", "-");
    if (isHome) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${solidHeader ? "header--scrolled" : "header--transparent"}`}>
        <div className="header__inner">

          {/* Logo */}
          <Link to="/" className="header__logo">
            <img src={LOGO_SRC} alt="True Life Foundation" className="header__logo-img" />
            <div className={`header__logo-text ${solidHeader ? "header__logo-text--dark" : "header__logo-text--light"}`}>
              True Life<br />Foundation
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="header__nav">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className={`header__nav-link ${solidHeader ? "header__nav-link--dark" : "header__nav-link--light"}`}
                onClick={() => scrollTo(link)}
              >
                {link}
              </button>
            ))}

            <Link
              to="/volunteer"
              className={`header__nav-link ${solidHeader ? "header__nav-link--dark" : "header__nav-link--light"}`}
              style={{ textDecoration: "none" }}
            >
              Volunteer
            </Link>

            <button className="header__cta" onClick={() => scrollTo("Donate")}>
              Donate Now
            </button>
          </nav>

          {/* Burger */}
          <button
            className="header__burger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`header__burger-line ${solidHeader ? "header__burger-line--dark" : "header__burger-line--light"}`}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <button key={link} className="mobile-menu__link" onClick={() => scrollTo(link)}>
            {link}
          </button>
        ))}
        <Link
          to="/volunteer"
          className="mobile-menu__link"
          style={{ textDecoration: "none", display: "block" }}
          onClick={() => setMenuOpen(false)}
        >
          Volunteer
        </Link>
        <button className="mobile-menu__cta" onClick={() => scrollTo("Donate")}>
          Donate Now
        </button>
      </div>
    </>
  );
}

export default Header;
