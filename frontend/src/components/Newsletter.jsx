import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    showToast('Thanks — first pick lands in your inbox soon 📬');
    setEmail('');
  }

  return (
    <section className="section-newsletter">
      <div className="container newsletter-inner">
        <div>
          <h3>Get first pick of the morning stock.</h3>
          <p>One email a week — what's fresh, what's on offer, nothing else.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email" required placeholder="you@example.com" aria-label="Email address"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <button type="submit" className="btn-tag btn-tag-primary">Notify me</button>
        </form>
      </div>
    </section>
  );
}
