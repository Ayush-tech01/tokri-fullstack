import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      // Admin always goes to the dashboard — a stale "return to this page after
      // login" location (e.g. from an earlier attempt to visit /checkout) should
      // never override that.
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log in — check your details and try again.');
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
            <p className="eyebrow">Welcome back</p>
            <h1>Log in to your thela</h1>
          </div>

          <div className="auth-card">
            {error && <div className="form-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <button className="btn-tag btn-tag-primary btn-tag-block" type="submit" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="form-hint">New here? <Link to="/register">Create an account</Link></p>

            <div className="demo-note">
              <strong>Demo accounts</strong>  —
              Admin: admin@tokri.in / admin123 · Customer: customer@tokri.in / customer123
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}