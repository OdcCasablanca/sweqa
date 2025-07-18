import React, { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();

  const getId = (item) => item.id || item._id;

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const productId = getId(product);
      const existingItem = prevItems.find(item => getId(item) === productId);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => prevItems.filter(item => getId(item) !== productId));
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(getId(product));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => getId(item) === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext; 