import { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';

const THEME_CLASS = { spinach: 'board-spinach', turmeric: 'board-turmeric', tomato: 'board-tomato' };

export default function OffersCarousel() {
  const { offers } = useShop();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (offers.length < 2) return;
    const id = setInterval(() => setIndex(i => (i + 1) % offers.length), 5000);
    return () => clearInterval(id);
  }, [offers.length]);

  useEffect(() => { setIndex(0); }, [offers.length]);

  if (!offers.length) return null;

  return (
    <section className="section section-offers" id="offers">
      <div className="container">
        <div className="section-head light">
          <p className="eyebrow">Chalked up today</p>
          <h2>The offer board</h2>
        </div>

        <div className="carousel slide signboard-carousel">
          <div className="carousel-indicators">
            {offers.map((o, i) => (
              <button
                key={o._id}
                type="button"
                className={i === index ? 'active' : ''}
                onClick={() => setIndex(i)}
                aria-label={`Show offer ${i + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {offers.map((o, i) => (
              <div className={`carousel-item ${i === index ? 'active' : ''}`} key={o._id}>
                <div className={`signboard ${THEME_CLASS[o.theme] || 'board-spinach'}`}>
                  <span className="board-eyebrow">{o.eyebrow}</span>
                  <h3>{o.title}</h3>
                  <p>{o.description}{o.code ? ` Use code ${o.code}.` : ''}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" onClick={() => setIndex(i => (i - 1 + offers.length) % offers.length)}>
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
            <span className="visually-hidden">Previous offer</span>
          </button>
          <button className="carousel-control-next" type="button" onClick={() => setIndex(i => (i + 1) % offers.length)}>
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
            <span className="visually-hidden">Next offer</span>
          </button>
        </div>

        <div className="row g-3 mt-1 combo-row">
          <div className="col-md-4">
            <div className="combo-card">
              <span className="combo-tag">Combo</span>
              <h4>Sunday Breakfast Set</h4>
              <p>Milk, bread, eggs &amp; butter — ₹40 off when bought together.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="combo-card">
              <span className="combo-tag">Combo</span>
              <h4>Chai Break Box</h4>
              <p>Tea, biscuits &amp; namkeen mix at a flat ₹149.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="combo-card">
              <span className="combo-tag">Combo</span>
              <h4>Clean House Kit</h4>
              <p>Detergent, dishwash &amp; floor cleaner — save ₹60.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
