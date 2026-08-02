import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const emptyProduct = { name: '', brand: '', category: '', price: '', mrp: '', unit: '', veg: true, icon: '🛒', stock: 20, rating: 4, description: '' };
const emptyCategory = { key: '', name: '', icon: '🛒', stamp: 'FRESH', themeColor: 'spinach' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [catForm, setCatForm] = useState(emptyCategory);
  const [showCatForm, setShowCatForm] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  async function load() {
    const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
    setProducts(p.data.products);
    setCategories(c.data.categories);
  }

  useEffect(() => { load(); }, []);

  function update(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function editProduct(p) {
    setEditingId(p._id);
    setForm({
      name: p.name, brand: p.brand, category: p.category?._id || p.category,
      price: p.price, mrp: p.mrp || '', unit: p.unit, veg: p.veg, icon: p.icon,
      stock: p.stock, rating: p.rating, description: p.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyProduct);
  }

  async function submitProduct(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, price: Number(form.price), mrp: form.mrp ? Number(form.mrp) : null, stock: Number(form.stock), rating: Number(form.rating) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        showToast('Product updated');
      } else {
        await api.post('/products', payload);
        showToast('Product added');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    showToast('Product deleted');
    load();
  }

  async function submitCategory(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', catForm);
      setCatForm(emptyCategory);
      setShowCatForm(false);
      showToast('Category added');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category');
    }
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast('Category deleted');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not delete — products still use it');
    }
  }

  return (
    <div>
      {error && <div className="form-error">{error}</div>}

      <div className="checkout-section">
        <h3>{editingId ? 'Edit product' : 'Add a product'}</h3>
        <form onSubmit={submitProduct}>
          <div className="admin-form-grid">
            <div className="form-field"><label>Name</label><input required value={form.name} onChange={update('name')} /></div>
            <div className="form-field"><label>Brand</label><input required value={form.brand} onChange={update('brand')} /></div>
            <div className="form-field">
              <label>Category</label>
              <select required value={form.category} onChange={update('category')}>
                <option value="">Select...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-field"><label>Price (₹)</label><input required type="number" value={form.price} onChange={update('price')} /></div>
            <div className="form-field"><label>MRP (optional)</label><input type="number" value={form.mrp} onChange={update('mrp')} /></div>
            <div className="form-field"><label>Unit</label><input required placeholder="1 kg / 500 ml" value={form.unit} onChange={update('unit')} /></div>
            <div className="form-field"><label>Icon (emoji)</label><input value={form.icon} onChange={update('icon')} /></div>
            <div className="form-field"><label>Stock</label><input type="number" value={form.stock} onChange={update('stock')} /></div>
            <div className="form-field"><label>Rating</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={update('rating')} /></div>
            <div className="form-field">
              <label>Diet</label>
              <select value={form.veg} onChange={e => setForm(f => ({ ...f, veg: e.target.value === 'true' }))}>
                <option value="true">Veg</option>
                <option value="false">Non-Veg</option>
              </select>
            </div>
          </div>
          <div className="form-field mt-2"><label>Description</label><textarea rows="2" value={form.description} onChange={update('description')} /></div>
          <div className="d-flex gap-2 mt-2">
            <button className="btn-tag btn-tag-primary" type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
            {editingId && <button className="btn-tag btn-tag-outline" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="m-0">Categories</h5>
        <button className="admin-tab" onClick={() => setShowCatForm(s => !s)}>
          <i className="bi bi-plus-lg me-1"></i> New category
        </button>
      </div>

      {showCatForm && (
        <form onSubmit={submitCategory} className="checkout-section">
          <div className="admin-form-grid">
            <div className="form-field"><label>Key (slug)</label><input required placeholder="e.g. bakery" value={catForm.key} onChange={e => setCatForm(c => ({ ...c, key: e.target.value }))} /></div>
            <div className="form-field"><label>Name</label><input required value={catForm.name} onChange={e => setCatForm(c => ({ ...c, name: e.target.value }))} /></div>
            <div className="form-field"><label>Icon</label><input value={catForm.icon} onChange={e => setCatForm(c => ({ ...c, icon: e.target.value }))} /></div>
            <div className="form-field"><label>Stamp text</label><input value={catForm.stamp} onChange={e => setCatForm(c => ({ ...c, stamp: e.target.value }))} /></div>
            <div className="form-field">
              <label>Theme colour</label>
              <select value={catForm.themeColor} onChange={e => setCatForm(c => ({ ...c, themeColor: e.target.value }))}>
                {['spinach', 'turmeric', 'turmericDeep', 'brinjal', 'slate', 'tomato'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-tag btn-tag-primary mt-2" type="submit">Add category</button>
        </form>
      )}

      <div className="admin-table-wrap mb-4">
        <table className="admin-table">
          <thead><tr><th></th><th>Name</th><th></th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td>{c.icon}</td>
                <td>{c.name}</td>
                <td><button className="admin-icon-btn danger" onClick={() => deleteCategory(c._id)}><i className="bi bi-trash3"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h5 className="mb-3">Products ({products.length})</h5>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th></th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.icon}</td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.category?.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock} {p.stock <= 10 && <span className="low-stock-pill">low</span>}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-icon-btn" onClick={() => editProduct(p)}><i className="bi bi-pencil"></i></button>
                    <button className="admin-icon-btn danger" onClick={() => deleteProduct(p._id)}><i className="bi bi-trash3"></i></button>
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
