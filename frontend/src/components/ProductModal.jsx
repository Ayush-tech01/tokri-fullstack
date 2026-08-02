import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!product) return null;

  async function handleAdd() {
    const ok = await addItem(product._id, qty, product.name);
    if (ok) onClose();
  }

  return (
    <>
      <div className="app-backdrop" onClick={onClose}></div>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <button type="button" className="btn-close modal-close-x" aria-label="Close" onClick={onClose}></button>
            <div className="modal-body-grid">
              <div className="modal-media">
                <div className="modal-icon-wrap"><span>{product.icon}</span></div>
                <span className="modal-quality-stamp">GRADE A</span>
              </div>
              <div className="modal-info">
                <p className="eyebrow">{product.category?.name}</p>
                <h3>{product.name}</h3>
                <p className="modal-brand">{product.brand} · {product.unit}</p>
                <div className="modal-rating">★ {product.rating} rating</div>
                <p className="modal-desc">{product.description}</p>

                <div className="modal-price-row">
                  <div className="hang-tag modal-tag">
                    <span className="hang-tag-price">₹{product.price}</span>
                    {product.mrp && <span className="hang-tag-mrp">₹{product.mrp}</span>}
                  </div>
                  <span className="stock-note">
                    {product.stock <= 10 ? `Only ${product.stock} left today` : 'In stock'}
                  </span>
                </div>

                <div className="modal-actions">
                  <div className="qty-stepper">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock || 20, q + 1))} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="btn-tag btn-tag-primary" onClick={handleAdd}>Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
