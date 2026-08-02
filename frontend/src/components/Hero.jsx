export default function Hero() {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase();

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">TODAY'S HARVEST · {today}</p>
          <h1>Picked this morning.<br />On your step by evening.</h1>
          <p className="hero-sub">No warehouse smell, no week-old shrivel. We buy straight from Punjab's mandis and dairies each dawn, then get it to your door the same day — receipts included, no fine print.</p>
          <div className="hero-cta">
            <a href="#products" className="btn-tag btn-tag-primary">Start shopping <i className="bi bi-arrow-right"></i></a>
            <a href="#offers" className="btn-tag btn-tag-outline">Today's offers</a>
          </div>
          <ul className="hero-facts">
            <li><i className="bi bi-truck"></i> Same-day slots across Chandigarh</li>
            <li><i className="bi bi-arrow-counterclockwise"></i> Wilted or bruised? Free pickup, full refund</li>
            <li><i className="bi bi-cash-coin"></i> Pay online, by card, or at the door</li>
          </ul>
        </div>

        <div className="hero-art">
          <div className="crate">
            <div className="crate-slats"></div>
            <div className="crate-items">
              <span>🍅</span><span>🥦</span><span>🍌</span><span>🥕</span><span>🍎</span><span>🌽</span>
            </div>
            <div className="crate-stamp">GRADE&nbsp;A</div>
          </div>
          <div className="hang-tag hero-tag">
            <span className="hang-tag-price">₹49</span>
            <span className="hang-tag-note">onwards, today only</span>
          </div>
        </div>
      </div>
    </section>
  );
}
