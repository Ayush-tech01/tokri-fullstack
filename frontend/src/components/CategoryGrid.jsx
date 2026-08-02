import { useShop } from '../context/ShopContext';

export default function CategoryGrid() {
  const { categories, filters, setCategoryOnly } = useShop();

  function selectCategory(id) {
    setCategoryOnly(id);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Shop by aisle</p>
          <h2>Six aisles. One thela.</h2>
        </div>

        <div className="row g-3 g-lg-4 category-row">
          {categories.map(c => (
            <div className="col-6 col-md-4 col-lg-2" key={c._id}>
              <button
                className={`cat-card cat-theme-${c.themeColor} ${filters.categories[0] === c._id ? 'selected' : ''}`}
                onClick={() => selectCategory(c._id)}
              >
                <span className="cat-icon">{c.icon}</span>
                <span className="cat-name">{c.name}</span>
                <span className="cat-stamp">{c.stamp}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
