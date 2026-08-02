import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer() {
  const { cart, cartOpen, closeCart, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  function goToCheckout() {
    closeCart();
    navigate(user ? '/checkout' : '/login', user ? undefined : { state: { from: '/checkout' } });
  }

  return (
    <>
      <div className="app-backdrop" onClick={closeCart}></div>
      <div className="offcanvas offcanvas-end cart-canvas show" style={{ visibility: 'visible' }} tabIndex="-1">
        <div className="offcanvas-header">
          <h5><i className="bi bi-basket2-fill"></i> Your thela</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={closeCart}></button>
        </div>
        <div className="offcanvas-body">
          {!cart.items.length ? (
            <div className="cart-empty">
              <p className="empty-emoji">🧺</p>
              <p>Your thela is empty. Go pick something fresh.</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map(item => {
                  const p = item.product;
                  return (
                    <div className="cart-item" key={p._id}>
                      <div className="cart-item-icon">{p.icon}</div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{p.name}</div>
                        <div className="cart-item-meta">{p.unit} · ₹{item.priceAtAdd} each</div>
                        <div className="cart-item-stepper">
                          <button onClick={() => (item.quantity === 1 ? removeItem(p._id) : updateItem(p._id, item.quantity - 1))}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateItem(p._id, item.quantity + 1)}>+</button>
                          <button className="cart-item-remove" aria-label="Remove item" onClick={() => removeItem(p._id)}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-price">₹{item.priceAtAdd * item.quantity}</div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-receipt">
                <div className="receipt-line"><span>Subtotal</span><span>₹{cart.itemsTotal}</span></div>
                <div className="receipt-line"><span>Delivery</span><span>{cart.deliveryFee === 0 ? 'Free' : `₹${cart.deliveryFee}`}</span></div>
                <p className="receipt-note">
                  {cart.itemsTotal >= cart.freeDeliveryThreshold
                    ? 'Free delivery unlocked — nice.'
                    : `Add ₹${cart.freeDeliveryThreshold - cart.itemsTotal} more for free delivery`}
                </p>
                <div className="receipt-divider"></div>
                <div className="receipt-line receipt-total"><span>Total</span><span>₹{cart.totalAmount}</span></div>
                <button className="btn-tag btn-tag-primary checkout-btn" onClick={goToCheckout}>
                  Proceed to checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
