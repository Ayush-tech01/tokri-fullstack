import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: 'bi-cash-coin' },
  { id: 'Card', label: 'Card', icon: 'bi-credit-card' },
  { id: 'UPI', label: 'UPI', icon: 'bi-phone' },
  { id: 'Wallet', label: 'Wallet', icon: 'bi-wallet2' },
  { id: 'NetBanking', label: 'Net Banking', icon: 'bi-bank' }
];

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    pincode: ''
  });
  const [method, setMethod] = useState('COD');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [failedOrderId, setFailedOrderId] = useState(null);
  const [error, setError] = useState('');

  function update(field) {
    return e => setDetails(d => ({ ...d, [field]: e.target.value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const res = await api.post('/orders/checkout', {
        deliveryDetails: details,
        paymentMethod: method,
        simulateFailure
      });
      navigate(`/order-confirmation/${res.data.order._id}`);
    } catch (err) {
      if (err.response?.status === 402) {
        setFailedOrderId(err.response.data.order._id);
        setError('Payment failed. You can try again below — no need to re-enter your details.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong placing your order.');
      }
    } finally {
      setPlacing(false);
    }
  }

  async function handleRetry() {
    setError('');
    setPlacing(true);
    try {
      const res = await api.post(`/orders/${failedOrderId}/retry-payment`, {
        paymentMethod: method,
        simulateFailure: false // retry always succeeds for the demo, unless toggled again below
      });
      navigate(`/order-confirmation/${res.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed again.');
    } finally {
      setPlacing(false);
    }
  }

  if (!cart.items.length && !failedOrderId) {
    return (
      <PageLayout>
        <div className="page-shell">
          <div className="container empty-wide">
            <p className="empty-emoji">🧺</p>
            <h4>Your thela is empty.</h4>
            <p>Add a few things before checking out.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-shell">
        <div className="container">
          <div className="page-head">
            <p className="eyebrow">Almost there</p>
            <h1>Checkout</h1>
          </div>

          {error && (
            <div className="payment-failed-banner">
              <span><strong>Heads up —</strong> {error}</span>
              {failedOrderId && (
                <button className="btn-tag btn-tag-primary" onClick={handleRetry} disabled={placing}>
                  {placing ? 'Retrying...' : 'Try payment again'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-grid">
              <div>
                <div className="checkout-section">
                  <h3>Delivery details</h3>
                  <div className="admin-form-grid">
                    <div className="form-field">
                      <label>Full name</label>
                      <input required value={details.fullName} onChange={update('fullName')} />
                    </div>
                    <div className="form-field">
                      <label>Phone</label>
                      <input required value={details.phone} onChange={update('phone')} />
                    </div>
                    <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                      <label>Address</label>
                      <input required value={details.address} onChange={update('address')} placeholder="House no., street, area" />
                    </div>
                    <div className="form-field">
                      <label>Pincode</label>
                      <input required value={details.pincode} onChange={update('pincode')} placeholder="160017" />
                    </div>
                  </div>
                </div>

                <div className="checkout-section">
                  <h3>Payment method</h3>
                  <div className="pay-method-grid">
                    {PAYMENT_METHODS.map(m => (
                      <div
                        key={m.id}
                        className={`pay-method ${method === m.id ? 'selected' : ''}`}
                        onClick={() => setMethod(m.id)}
                      >
                        <i className={`bi ${m.icon}`}></i>
                        {m.label}
                      </div>
                    ))}
                  </div>

                  <label className="filter-check" style={{ marginTop: '1rem' }}>
                    <input type="checkbox" checked={simulateFailure} onChange={e => setSimulateFailure(e.target.checked)} />
                    Simulate a failed payment (for demo purposes)
                  </label>
                </div>
              </div>

              <div className="order-summary-card">
                <h3>Order summary</h3>
                <div className="order-summary-items">
                  {cart.items.map(i => (
                    <div className="order-summary-item" key={i.product._id}>
                      <span>{i.product.name} × {i.quantity}</span>
                      <span>₹{i.priceAtAdd * i.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-summary-line"><span>Subtotal</span><span>₹{cart.itemsTotal}</span></div>
                <div className="order-summary-line"><span>Delivery</span><span>{cart.deliveryFee === 0 ? 'Free' : `₹${cart.deliveryFee}`}</span></div>
                <div className="order-summary-line total"><span>Total</span><span>₹{cart.totalAmount}</span></div>
                <button className="btn-tag btn-tag-primary btn-tag-block" type="submit" style={{ marginTop: '1rem' }} disabled={placing || !cart.items.length}>
                  {placing ? 'Placing order...' : 'Place order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
