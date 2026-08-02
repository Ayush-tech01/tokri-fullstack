import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
    api.get(`/orders/${id}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Could not load this order'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <PageLayout>
        <div className="page-shell"><div className="container empty-wide"><p>{error}</p></div></div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout>
        <div className="page-shell"><div className="spinner-wrap"><i className="bi bi-arrow-repeat spin"></i> Loading your order...</div></div>
      </PageLayout>
    );
  }

  const { order, delivery, payment } = data;

  return (
    <PageLayout>
      <div className="page-shell">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="confirm-hero">
            <div className="stamp-circle"><i className="bi bi-check-lg"></i></div>
            <h1>Order confirmed!</h1>
            <p>Your thela's being packed — here's your receipt.</p>
            <span className="order-number-tag">{order.orderNumber}</span>
          </div>

          <div className="checkout-section">
            <h3>Items</h3>
            {order.items.map(item => (
              <div className="order-summary-item" key={item.product} style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                <span>{item.name} ({item.unit}) × {item.quantity}</span>
                <span>₹{item.subtotal}</span>
              </div>
            ))}
            <div className="receipt-divider"></div>
            <div className="receipt-line"><span>Subtotal</span><span>₹{order.itemsTotal}</span></div>
            <div className="receipt-line"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</span></div>
            <div className="receipt-line receipt-total"><span>Total paid</span><span>₹{order.totalAmount}</span></div>
          </div>

          <div className="checkout-section">
            <h3>Delivery</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
              {order.deliveryDetails.fullName} · {order.deliveryDetails.phone}<br />
              {order.deliveryDetails.address}, {order.deliveryDetails.pincode}
            </p>
            {delivery && (
              <p style={{ fontSize: '0.9rem' }}>
                Estimated: <strong>{new Date(delivery.deliveryDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</strong>
                {' '}· Status: <span className={`status-badge status-${delivery.deliveryStatus.replace(/\s/g, '')}`}>{delivery.deliveryStatus}</span>
              </p>
            )}
          </div>

          <div className="checkout-section">
            <h3>Payment</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Method: <strong>{order.paymentMethod}</strong> · Status:{' '}
              <span className={`status-badge status-${order.paymentStatus}`}>{order.paymentStatus}</span>
              {payment?.transactionId && <> · Txn: <span style={{ fontFamily: 'var(--font-mono)' }}>{payment.transactionId}</span></>}
            </p>
          </div>

          <div className="d-flex gap-3 justify-content-center mt-4">
            <Link to="/orders" className="btn-tag btn-tag-outline">View my orders</Link>
            <Link to="/" className="btn-tag btn-tag-primary">Keep shopping</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
