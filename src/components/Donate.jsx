const AMOUNTS = ["₹500", "₹1,000", "₹5,000", "Custom"];

function Donate() {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__card">
          <span className="donate__emoji">💚</span>

          <h2 className="donate__title">Make a Donation</h2>

          <p className="donate__subtitle">
            Your generous contribution helps us continue our vital work and
            reach more communities in need. Every rupee counts.
          </p>

          {/* Quick-select amounts */}
          <div className="donate__amounts">
            {AMOUNTS.map((amt) => (
              <button key={amt} className="btn btn--ghost">
                {amt}
              </button>
            ))}
          </div>

          {/* Main CTA */}
          <button className="btn btn--white-solid">
            🔒 Donate Securely Online
          </button>

          <p className="donate__note">
            You can also volunteer or explore corporate partnership opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Donate;
