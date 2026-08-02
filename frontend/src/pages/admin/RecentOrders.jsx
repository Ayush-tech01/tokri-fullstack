import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const WINDOWS = [
  { label: 'Last 30 min', minutes: 30 },
  { label: 'Last hour', minutes: 60 },
  { label: 'Last 4 hours', minutes: 240 },
  { label: 'Today', minutes: 1440 }
];

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ${mins % 60}m ago`;
}

export default function RecentOrders() {
  const [minutes, setMinutes] = useState(60);
  const [data, setData] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const res = await api.get(`/admin/reports/recent-orders?minutes=${minutes}`);
    setData(res.data);
  }, [minutes]);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000); // auto-refresh every 30s
    return () => clearInterval(id);
  }, [load]);

  async function quickConfirm(orderId) {
    await api.patch(`/orders/${orderId}/status`, { orderStatus: 'Confirmed' });
    showToast('Order confirmed');
    load();
  }

  return (
    <div className="recent-orders-panel">
      <div className="recent-orders-head">
        <h5><span className="live-dot"></span> Recent orders</h5>
        <select className="sort-select" value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
          {WINDOWS.map(w => <option key={w.minutes} value={w.minutes}>{w.label}</option>)}
        </select>
      </div>

      {!data ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Loading...</p>
      ) : data.orders.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
          No orders in this window yet — they'll show up here the moment someone checks out.
        </p>
      ) : (
        <>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginBottom: '0.4rem' }}>
            {data.count} order{data.count !== 1 ? 's' : ''} · worth ₹{data.orders.reduce((s, o) => s + o.totalAmount, 0)}
          </p>
          {data.orders.map(o => (
            <div className="recent-order-row" key={o._id}>
              <div>
                <Link to={`/order-confirmation/${o._id}`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {o.orderNumber}
                </Link>
                {' '}· {o.customer?.name || 'Customer'} · ₹{o.totalAmount}
                <div className="recent-order-time">{timeAgo(o.createdAt)}</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`status-badge status-${o.orderStatus.replace(/\s/g, '')}`}>{o.orderStatus}</span>
                {o.orderStatus === 'Pending' && (
                  <button className="admin-icon-btn" title="Confirm order" onClick={() => quickConfirm(o._id)}>
                    <i className="bi bi-check-lg"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
