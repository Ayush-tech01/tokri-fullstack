import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const EMPTY_CART = { items: [], itemsTotal: 0, deliveryFee: 0, totalAmount: 0, freeDeliveryThreshold: 499 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState(EMPTY_CART);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {
      // ignore — most likely not authenticated yet
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  async function addItem(productId, quantity = 1, productName = 'Item') {
    if (!user) {
      showToast('Log in to start filling your thela 🧺');
      return false;
    }
    const res = await api.post('/cart/items', { productId, quantity });
    setCart(res.data);
    showToast(`${productName} added to your thela 🧺`);
    return true;
  }

  async function updateItem(productId, quantity) {
    const res = await api.patch(`/cart/items/${productId}`, { quantity });
    setCart(res.data);
  }

  async function removeItem(productId) {
    const res = await api.delete(`/cart/items/${productId}`);
    setCart(res.data);
  }

  async function clearCart() {
    const res = await api.delete('/cart');
    setCart(res.data);
  }

  const totalQty = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const qtyByProductId = Object.fromEntries(
    cart.items.map(i => [(i.product && i.product._id) || i.product, i.quantity])
  );

  return (
    <CartContext.Provider value={{
      cart, loading, totalQty, qtyByProductId,
      addItem, updateItem, removeItem, clearCart, refreshCart,
      cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
