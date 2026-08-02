import { useEffect, useState } from 'react';
import api from '../../api/axios';
import RecentOrders from './RecentOrders';
import InventoryQuickEdit from './InventoryQuickEdit';

export default function AdminOverview() {
  const [sales, setSales] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/reports/sales'), api.get('/admin/reports/inventory')])
      .then(([s, i]) => { setSales(s.data); setInventory(i.data); })
      .catch(err => setError(err.response?.data?.message || 'Could not load reports'));
  }, []);

  if (error) return <div className="form-error">{error}</div>;
  if (!sales || !inventory) return <div className="spinner-wrap"><i className="bi bi-arrow-repeat spin"></i> Loading reports...</div>;

  return (
    <div>
      <div className="admin-stat-row">
        <div className="admin-stat-card">
          <div className="stat-label">Revenue (all-time, paid)</div>
          <div className="stat-value">₹{sales.summary.totalRevenue || 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Paid orders</div>
          <div className="stat-value">{sales.summary.totalOrders || 0}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Avg order value</div>
          <div className="stat-value">₹{Math.round(sales.summary.avgOrderValue || 0)}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Low stock items</div>
          <div className="stat-value">{inventory.lowStock.length}</div>
        </div>
      </div>

      <RecentOrders />

      <div className="row g-4">
        <div className="col-lg-6">
          <h5 className="mb-3">Orders by status</h5>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Status</th><th>Count</th></tr></thead>
              <tbody>
                {sales.byStatus.map(s => (
                  <tr key={s._id}><td>{s._id}</td><td>{s.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h5 className="mb-3 mt-4">Top products</h5>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Units sold</th><th>Revenue</th></tr></thead>
              <tbody>
                {sales.topProducts.map(p => (
                  <tr key={p._id}><td>{p._id}</td><td>{p.unitsSold}</td><td>₹{p.revenue}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Inventory — click a price or stock number to edit</h5>
          </div>
          <InventoryQuickEdit />
        </div>
      </div>
    </div>
  );
}
