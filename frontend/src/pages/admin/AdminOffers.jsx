import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const emptyOffer = { eyebrow: 'Offer', title: '', description: '', code: '', theme: 'spinach', active: true };

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState(emptyOffer);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  async function load() {
    const res = await api.get('/offers/admin/all');
    setOffers(res.data.offers);
  }

  useEffect(() => { load(); }, []);

  function update(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function edit(o) {
    setEditingId(o._id);
    setForm({ eyebrow: o.eyebrow, title: o.title, description: o.description, code: o.code || '', theme: o.theme, active: o.active });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyOffer);
  }

  async function submit(e) {
    e.preventDefault();
    if (editingId) {
      await api.put(`/offers/${editingId}`, form);
      showToast('Offer updated');
    } else {
      await api.post('/offers', form);
      showToast('Offer added');
    }
    resetForm();
    load();
  }

  async function toggleActive(o) {
    await api.put(`/offers/${o._id}`, { active: !o.active });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this offer?')) return;
    await api.delete(`/offers/${id}`);
    showToast('Offer deleted');
    load();
  }

  return (
    <div>
      <div className="checkout-section">
        <h3>{editingId ? 'Edit offer' : 'Add an offer'}</h3>
        <form onSubmit={submit}>
          <div className="admin-form-grid">
            <div className="form-field"><label>Eyebrow</label><input value={form.eyebrow} onChange={update('eyebrow')} placeholder="FLAT DISCOUNT" /></div>
            <div className="form-field"><label>Title</label><input required value={form.title} onChange={update('title')} placeholder="20% off your first thela" /></div>
            <div className="form-field"><label>Code (optional)</label><input value={form.code} onChange={update('code')} placeholder="PEHLA20" /></div>
            <div className="form-field">
              <label>Theme</label>
              <select value={form.theme} onChange={update('theme')}>
                <option value="spinach">Spinach (green)</option>
                <option value="turmeric">Turmeric (yellow)</option>
                <option value="tomato">Tomato (red)</option>
              </select>
            </div>
          </div>
          <div className="form-field mt-2"><label>Description</label><textarea rows="2" value={form.description} onChange={update('description')} /></div>
          <div className="d-flex gap-2 mt-2">
            <button className="btn-tag btn-tag-primary" type="submit">{editingId ? 'Save changes' : 'Add offer'}</button>
            {editingId && <button className="btn-tag btn-tag-outline" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Code</th><th>Theme</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {offers.map(o => (
              <tr key={o._id}>
                <td>{o.title}</td>
                <td>{o.code || '—'}</td>
                <td>{o.theme}</td>
                <td>
                  <button className="admin-tab" style={{ padding: '0.2rem 0.7rem' }} onClick={() => toggleActive(o)}>
                    {o.active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-icon-btn" onClick={() => edit(o)}><i className="bi bi-pencil"></i></button>
                    <button className="admin-icon-btn danger" onClick={() => remove(o._id)}><i className="bi bi-trash3"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
