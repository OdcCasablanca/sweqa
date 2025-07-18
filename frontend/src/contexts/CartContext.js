import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item =>
        item.id === product.id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
      );

      if (itemInCart) {
        return prevItems.map(item =>
          item.id === product.id &&
          item.selectedColor === product.selectedColor &&
          item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Find the main image or fallback to the first one
      const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];

      const newItem = {
        ...product,
        quantity: 1,
        image: mainImage ? mainImage.url : '/default-product.png' // Ensure there's a fallback
      };
      
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (productId, selectedColor, selectedSize) => {
    setCartItems(prevItems => prevItems.filter(item =>
      !(item.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize)
    ));
  };

  const updateQuantity = (productId, change, selectedColor, selectedSize) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 