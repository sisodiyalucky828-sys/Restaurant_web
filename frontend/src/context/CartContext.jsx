import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('velvet_brew_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('velvet_brew_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i._id === item._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated quantity for ${item.name}`);
        return updated;
      } else {
        toast.success(`Added ${item.name} to cart`);
        return [
          ...prev,
          {
            _id: item._id,
            menuItem: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            quantity: quantity,
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === itemId ? { ...item, quantity } : item))
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const item = prev.find((i) => i._id === itemId);
      if (item) {
        toast.error(`Removed ${item.name} from cart`);
      }
      return prev.filter((i) => i._id !== itemId);
    });
  };

  // Clear all items from cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('velvet_brew_cart');
  };

  // Derived totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const total = Math.round((subtotal + tax) * 100) / 100;
  const totalItems = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
