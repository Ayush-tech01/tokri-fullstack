import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

function EditableNumber({ value, prefix = '', onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [justSaved, setJustSaved] = useState(false);

  async function save() {
    setEditing(false);
    if (Number(draft) === value) return;
    await onSave(Number(draft));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  }

  if (editing) {
    return (
      <input
        className="inline-edit-input"
        type="number"
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={e => e.key === 'Enter' && save()}
      />
    );
  }

  return (
    <span style={{ cursor: 'pointer' }} onClick={() => { setDraft(value); setEditing(true); }} title="Click to edit">
      {prefix}{value} <i className="bi bi-pencil" style={{ fontSize: '0.65rem', color: 'var(--ink-soft)' }}></i>
      {justSaved && <span className="saved-flash">saved</span>}
    </span>
  );
}

export default function InventoryQuickEdit() {
  const [products, setProducts] = useState(null);
  const { showToast } = useToast();

  async function load() {
    const res = await api.get('/admin/reports/inventory');
    setProducts(res.data.products);
  }

  useEffect(() => { load(); }, []);

  async function updateProduct(id, patch) {
    await api.put(`/products/${id}`, patch);
    load();
  }

  async function bumpStock(id, current, by) {
    await updateProduct(id, { stock: Math.max(0, current + by) });
    showToast(`Stock updated`);
  }

  if (!products) return <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Loading inventory...</p>;

  const sorted = [...products].sort((a, b) => a.stock - b.stock);

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Quick restock</th></tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category?.name}</td>
              <td>
                <EditableNumber value={p.price} prefix="₹" onSave={val => updateProduct(p._id, { price: val })} />
              </td>
              <td>
                <EditableNumber value={p.stock} onSave={val => updateProduct(p._id, { stock: val })} />
                {' '}{p.stock <= 10 && <span className="low-stock-pill">low</span>}
              </td>
              <td>
                <div className="quick-restock">
                  <button onClick={() => bumpStock(p._id, p.stock, 5)}>+5</button>
                  <button onClick={() => bumpStock(p._id, p.stock, 10)}>+10</button>
                  <button onClick={() => bumpStock(p._id, p.stock, 25)}>+25</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
