function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero__bg-img" />
      <div className="hero__decor-1" />
      <div className="hero__decor-2" />

      <div className="hero__content">
        <div className="hero__pill">🌱 Making a Difference Since 2023</div>

        <h1 className="hero__title">
          Empowering Communities,
          <span className="hero__title-accent">Building Futures</span>
        </h1>

        <p className="hero__subtitle">
          Join us in our mission to create lasting positive change through
          education, health, and social welfare initiatives.
        </p>

        <div className="hero__btns">
          <button
            className="btn btn--primary"
            onClick={() => scrollTo("donate")}
          >
            💚 Donate Now
          </button>
          <button
            className="btn btn--outline"
            onClick={() => scrollTo("about")}
          >
            Learn More →
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
