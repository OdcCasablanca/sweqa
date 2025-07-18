import React from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../contexts/WishlistContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      <div className="wishlist-container">
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <h2>Your wishlist is empty</h2>
            <p>Save items you want to buy later!</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-item">
                <img src={item.image} alt={item.name} className="item-image" />
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>

                <div className="item-actions">
                  <button 
                    onClick={() => moveToCart(item)}
                    className="move-to-cart-btn"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 