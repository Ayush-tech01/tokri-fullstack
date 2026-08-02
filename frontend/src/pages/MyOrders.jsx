import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.orders))
      .catch(err => setError(err.response?.data?.message || 'Could not load your orders'));
  }, []);

  return (
    <PageLayout>
      <div className="page-shell">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="page-head">
            <p className="eyebrow">Your history</p>
            <h1>My orders</h1>
          </div>

          {error && <div className="form-error">{error}</div>}

          {!orders ? (
            <div className="spinner-wrap"><i className="bi bi-arrow-repeat spin"></i> Loading...</div>
          ) : orders.length === 0 ? (
            <div className="empty-wide">
              <p className="empty-emoji">🧾</p>
              <h4>No orders yet.</h4>
              <p>Once you place an order, it'll show up here.</p>
              <Link to="/" className="btn-tag btn-tag-primary mt-3">Start shopping</Link>
            </div>
          ) : (
            orders.map(o => (
              <div className="order-card" key={o._id}>
                <div className="order-card-top">
                  <div>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{o.orderNumber}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                      {new Date(o.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <span className={`status-badge status-${o.orderStatus.replace(/\s/g, '')}`}>{o.orderStatus}</span>
                    <span className={`status-badge status-${o.paymentStatus}`}>{o.paymentStatus}</span>
                  </div>
                </div>
                <div className="order-card-items">
                  {o.items.slice(0, 3).map(i => i.name).join(', ')}
                  {o.items.length > 3 ? ` +${o.items.length - 3} more` : ''}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>₹{o.totalAmount}</strong>
                  <Link to={`/order-confirmation/${o._id}`} className="link-plain">View details</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
