import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account — please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout hideTopBar hideNavBar>
      <div className="auth-minimal-header">
        <Link className="brand-mark" to="/">tokri<span className="brand-dot">.</span></Link>
      </div>
      <div className="page-shell narrow">
        <div className="container">
          <div className="page-head text-center">
            <p className="eyebrow">First time here?</p>
            <h1>Create your account</h1>
          </div>

          <div className="auth-card">
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="name">Full name</label>
                <input id="name" required value={form.name} onChange={update('name')} placeholder="Ayush Sharma" />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" required value={form.phone} onChange={update('phone')} placeholder="98765 43210" />
              </div>
              <div className="form-field">
                <label htmlFor="address">Address (optional)</label>
                <input id="address" value={form.address} onChange={update('address')} placeholder="House no., street, area" />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" required value={form.password} onChange={update('password')} placeholder="At least 6 characters" />
              </div>
              <button className="btn-tag btn-tag-primary btn-tag-block" type="submit" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="form-hint">Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}