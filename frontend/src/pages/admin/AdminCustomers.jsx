import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/admin/customers').then(res => setCustomers(res.data.customers));
  }, []);

  return (
    <div>
      <h5 className="mb-3">Customers ({customers.length})</h5>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Joined</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.address || '—'}</td>
                <td>{new Date(c.registrationDate).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
