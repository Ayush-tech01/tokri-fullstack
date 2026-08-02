import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { qtyByProductId, addItem, updateItem, removeItem } = useCart();
  const qty = qtyByProductId[product._id] || 0;
  const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : null;

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="product-card">
        {discount ? <span className="pc-badge">{discount}% off</span> : null}
        <div className="pc-top">
          <span className={`pc-diet ${product.veg ? 'veg' : 'nonveg'}`}>
            <span className="dot"></span> {product.veg ? 'Veg' : 'Non-Veg'}
          </span>
          <button className="pc-icon-btn" aria-label="Quick view" title="Quick view" onClick={() => onQuickView(product)}>
            <i className="bi bi-eye"></i>
          </button>
        </div>

        <button className="pc-icon" style={{ background: 'none', border: 'none', width: '100%' }} onClick={() => onQuickView(product)}>
          {product.icon}
        </button>

        <div className="pc-name">{product.name}</div>
        <div className="pc-meta">{product.brand} · {product.unit}</div>
        <div className="pc-rating">★ {product.rating}</div>

        <div className="pc-bottom">
          <div className="pc-price">
            <span className="price-now">₹{product.price}</span>
            {product.mrp ? <span className="price-mrp">₹{product.mrp}</span> : null}
          </div>
          <div className="pc-actions">
            {qty > 0 ? (
              <div className="pc-stepper">
                <button onClick={() => (qty === 1 ? removeItem(product._id) : updateItem(product._id, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => updateItem(product._id, qty + 1)}>+</button>
              </div>
            ) : (
              <button className="pc-add" onClick={() => addItem(product._id, 1, product.name)}>Add</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
