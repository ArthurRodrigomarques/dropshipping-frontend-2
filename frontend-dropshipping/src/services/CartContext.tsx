"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: {imageUrl: string} []
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const getUserCartKey = (token: string | null) => `cart_${token}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setToken(user.id);
      const storedCart = localStorage.getItem(getUserCartKey(user.id));
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(getUserCartKey(token), JSON.stringify(cart));
    }
  }, [cart, token]);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};
