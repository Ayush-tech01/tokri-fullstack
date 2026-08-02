import { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminOffers from './AdminOffers';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'bi-graph-up' },
  { id: 'products', label: 'Products & Categories', icon: 'bi-box-seam' },
  { id: 'offers', label: 'Offers', icon: 'bi-megaphone' },
  { id: 'orders', label: 'Orders', icon: 'bi-receipt' },
  { id: 'customers', label: 'Customers', icon: 'bi-people' }
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');

  return (
    <PageLayout>
      <div className="page-shell">
        <div className="container">
          <div className="page-head">
            <p className="eyebrow">Admin</p>
            <h1>Run the mandi</h1>
          </div>

          <div className="admin-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`admin-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <i className={`bi ${t.icon} me-1`}></i> {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && <AdminOverview />}
          {tab === 'products' && <AdminProducts />}
          {tab === 'offers' && <AdminOffers />}
          {tab === 'orders' && <AdminOrders />}
          {tab === 'customers' && <AdminCustomers />}
        </div>
      </div>
    </PageLayout>
  );
}
