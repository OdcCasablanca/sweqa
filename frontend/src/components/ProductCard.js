import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Handle both old format (product.image) and new format (product.images array)
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      // Find main image or use first image
      const mainImage = product.images.find(img => img.isMain);
      return mainImage?.url || product.images[0].url;
    }
    // Fallback to old format
    return product.image || '/assets/figma/ai-hero-section.png';
  };

  const handleAddToCart = () => {
    const productWithId = { ...product, id: product._id || product.id };
    addToCart(productWithId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <motion.div className="product-card" whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(255,136,0,0.12)' }}>
      <img className="product-card-img" src={getProductImage()} alt={product.name} />
      <div className="product-card-info">
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-price">${product.price}</span>
      </div>
      <motion.button 
        className="product-card-btn" 
        whileHover={{ backgroundColor: '#ff8800', color: '#fff' }}
        onClick={handleAddToCart}
        disabled={added}
      >
        {added ? 'Added!' : 'Add to Cart'}
      </motion.button>
    </motion.div>
  );
} 