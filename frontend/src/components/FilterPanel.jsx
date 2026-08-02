import { useShop } from '../context/ShopContext';

export default function FilterPanel() {
  const { categories, brands, filters, updateFilter, resetFilters } = useShop();

  function toggleCategory(id) {
    const next = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id];
    updateFilter({ categories: next });
  }

  function toggleBrand(b) {
    const next = filters.brands.includes(b)
      ? filters.brands.filter(x => x !== b)
      : [...filters.brands, b];
    updateFilter({ brands: next });
  }

  return (
    <div className="filter-panel">
      <div className="filter-head">
        <h5>Filter</h5>
        <button className="reset-link" onClick={resetFilters}>Reset</button>
      </div>

      <div className="filter-block">
        <label className="filter-label">Diet</label>
        <div className="veg-toggle">
          {['all', 'veg', 'nonveg'].map(v => (
            <button
              key={v}
              className={`veg-btn ${filters.veg === v ? 'active' : ''}`}
              onClick={() => updateFilter({ veg: v })}
            >
              {v === 'all' ? 'All' : v === 'veg' ? 'Veg' : 'Non-Veg'}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label" htmlFor="priceRange">Price, up to ₹{filters.maxPrice}</label>
        <input
          type="range" className="form-range" id="priceRange"
          min="15" max="250" step="5"
          value={filters.maxPrice}
          onChange={e => updateFilter({ maxPrice: Number(e.target.value) })}
        />
      </div>

      <div className="filter-block">
        <label className="filter-label">Category</label>
        <div className="filter-list">
          {categories.map(c => (
            <label className="filter-check" key={c._id}>
              <input
                type="checkbox"
                checked={filters.categories.includes(c._id)}
                onChange={() => toggleCategory(c._id)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label">Brand</label>
        <div className="filter-list">
          {brands.map(b => (
            <label className="filter-check" key={b}>
              <input
                type="checkbox"
                checked={filters.brands.includes(b)}
                onChange={() => toggleBrand(b)}
              />
              {b}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
