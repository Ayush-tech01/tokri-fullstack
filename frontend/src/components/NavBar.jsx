import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { totalQty, openCart } = useCart();
  const { filters, updateFilter } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Hysteresis: different on/off thresholds so scrolling right around one
        // number can't flip the class back and forth dozens of times a second.
        setScrolled(prev => (prev ? y > 15 : y > 40));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSearch(e) {
    updateFilter({ search: e.target.value });
    if (location.pathname !== '/') navigate('/');
  }

  function goTo(hash) {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Admins get a focused nav — no shopping search, cart, or storefront links —
  // so it's obviously a different mode, not just the customer site with extra links.
  if (isAdmin) {
    return (
      <nav className={`navbar navbar-expand-lg main-nav sticky-top ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-row">
          <Link className="brand-mark" to="/admin">
            tokri<span className="brand-dot">.</span> <span className="admin-mode-tag">admin</span>
          </Link>
          <div className="nav-actions">
            <Link className="link-plain" to="/" style={{ fontSize: '0.85rem', marginRight: '1rem' }}>
              View storefront
            </Link>
            <span className="d-none d-lg-inline" style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.4rem' }}>
              {user.name}
            </span>
            <button className="icon-btn" title="Log out" aria-label="Log out" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`navbar navbar-expand-lg main-nav sticky-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-row">
        <div className="nav-left">
          <Link className="brand-mark" to="/" onClick={() => setMenuOpen(false)}>
            tokri<span className="brand-dot">.</span>
          </Link>

          <div className="nav-search">
            <i className="bi bi-search"></i>
            <input
              type="search"
              placeholder="Search for atta, milk, chips, cold drink..."
              value={filters?.search || ''}
              onChange={handleSearch}
            />
          </div>
        </div>

        <button className="navbar-toggler d-lg-none" type="button" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle navigation">
          <i className="bi bi-list"></i>
        </button>

        <div className={`nav-right ${menuOpen ? 'open' : ''}`}>
          <div className="nav-search">
            <i className="bi bi-search"></i>
            <input
              type="search"
              placeholder="Search for atta, milk, chips, cold drink..."
              value={filters?.search || ''}
              onChange={handleSearch}
            />
          </div>

          <ul className="main-links">
            <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => goTo('home')}>Home</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => goTo('categories')}>Categories</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => goTo('offers')}>Offers</button></li>
            <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => goTo('products')}>Shop</button></li>
            {user && <li className="nav-item"><Link className="nav-link" to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>}
          </ul>

          <div className="nav-actions">
            {user ? (
              <>
                <span className="d-none d-lg-inline" style={{ fontSize: '0.85rem', fontWeight: 600, marginRight: '0.4rem' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button className="icon-btn" title="Log out" aria-label="Log out" onClick={logout}>
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <Link className="icon-btn" to="/login" title="Log in" aria-label="Log in">
                <i className="bi bi-person"></i>
              </Link>
            )}
            <button className="icon-btn cart-toggle" onClick={openCart} aria-label="Open cart">
              <i className="bi bi-basket2-fill"></i>
              <span className="hang-badge">{totalQty}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}