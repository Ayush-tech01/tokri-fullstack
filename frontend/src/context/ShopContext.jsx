import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const ShopContext = createContext(null);

const initialFilters = {
  search: '',
  veg: 'all',       // all | veg | nonveg
  maxPrice: 250,
  categories: [],    // array of category _id
  brands: [],        // array of brand strings
  sort: 'default'
};

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    (async () => {
      try {
        const [productsRes, categoriesRes, offersRes, brandsRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/offers'),
          api.get('/products/brands')
        ]);
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
        setOffers(offersRes.data.offers);
        setBrands(brandsRes.data.brands);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not reach the tokri. server. Is the backend running?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updateFilter(patch) {
    setFilters(prev => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  function setCategoryOnly(categoryId) {
    setFilters(prev => ({ ...prev, categories: [categoryId] }));
  }

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const catId = p.category?._id || p.category;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!`${p.name} ${p.brand}`.toLowerCase().includes(q)) return false;
      }
      if (filters.veg === 'veg' && !p.veg) return false;
      if (filters.veg === 'nonveg' && p.veg) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.categories.length && !filters.categories.includes(catId)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      return true;
    });

    if (filters.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating-desc') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, filters]);

  return (
    <ShopContext.Provider value={{
      products, categories, offers, brands, loading, error,
      filters, updateFilter, resetFilters, setCategoryOnly, filteredProducts
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
