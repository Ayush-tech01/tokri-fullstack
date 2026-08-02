import { useShop } from '../context/ShopContext';

export default function Footer() {
  const shop = useShop();

  function jumpToCategory(catId) {
    shop?.setCategoryOnly(catId);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer id="contact">
      <div className="container footer-grid">
        <div>
          <a className="brand-mark footer-brand" href="#home">tokri<span className="brand-dot">.</span></a>
          <p className="footer-about">A same-day grocery thela from Ludhiana — fresh produce, dairy and daily essentials, sourced from local mandis and farms every morning.</p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
          </div>
        </div>
        <div>
          <h6>Quick links</h6>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#offers">Offers</a></li>
            <li><a href="#products">Shop</a></li>
          </ul>
        </div>
        <div>
          <h6>Aisles</h6>
          <ul>
            {shop?.categories.map(c => (
              <li key={c._id}>
                <button className="link-plain" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => jumpToCategory(c._id)}>
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6>Reach us</h6>
          <ul className="footer-contact">
            <li><i className="bi bi-geo-alt"></i> Ferozepur Road, Ludhiana, Punjab 141001</li>
            <li><i className="bi bi-telephone"></i> 1800-000-1234</li>
            <li><i className="bi bi-envelope"></i> hello@tokri.in</li>
          </ul>
          <div className="pay-icons">
            <span>UPI</span><span>Cards</span><span>COD</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container d-flex flex-wrap justify-content-between gap-2">
          <span>© 2026 tokri. All produce sold as-is-fresh.</span>
          <span>Crafted by Ayush Bhatt</span>
        </div>
      </div>
    </footer>
  );
}
