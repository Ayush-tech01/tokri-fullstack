import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import FilterPanel from './FilterPanel';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const { filteredProducts, filters, updateFilter, loading, error } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="section" id="products">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">In today's basket</p>
          <h2>Fresh picks for you</h2>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <FilterPanel />
          </div>

          <div className="col-lg-9">
            <div className="grid-toolbar">
              <span>{loading ? 'Loading...' : `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''}`}</span>
              <select className="sort-select" value={filters.sort} onChange={e => updateFilter({ sort: e.target.value })}>
                <option value="default">Sort: as picked</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating-desc">Rating: best first</option>
              </select>
            </div>

            {error && <div className="form-error">{error}</div>}

            {loading ? (
              <div className="spinner-wrap"><i className="bi bi-arrow-repeat spin"></i> Fetching today's stock...</div>
            ) : filteredProducts.length ? (
              <div className="row g-3 g-md-4">
                {filteredProducts.map(p => (
                  <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-emoji">🧺</p>
                <h4>This aisle's empty.</h4>
                <p>Nothing matches those filters right now — try widening the price range or clearing a filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {quickViewProduct && (
        <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </section>
  );
}
