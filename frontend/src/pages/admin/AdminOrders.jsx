import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  async function load() {
    const res = await api.get('/orders/admin/all');
    setOrders(res.data.orders);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, orderStatus) {
    await api.patch(`/orders/${id}/status`, { orderStatus });
    showToast('Order status updated');
    load();
  }

  const filtered = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) || (o.customer?.name || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="m-0">All orders ({filtered.length}{filtered.length !== orders.length ? ` of ${orders.length}` : ''})</h5>
        <input
          className="inline-edit-input"
          style={{ width: '220px' }}
          placeholder="Search order # or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o._id}>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{o.orderNumber}</td>
                <td>{o.customer?.name}<br /><small style={{ color: 'var(--ink-soft)' }}>{o.customer?.phone}</small></td>
                <td>{o.items.length} item(s)</td>
                <td>₹{o.totalAmount}</td>
                <td><span className={`status-badge status-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                <td>
                  <select
                    className="sort-select"
                    value={o.orderStatus}
                    onChange={e => updateStatus(o._id, e.target.value)}
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
