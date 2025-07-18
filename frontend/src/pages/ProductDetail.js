import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './ProductDetail.css';

const product = {
  id: 1,
  name: 'Orange Headphones',
  price: 199,
  image: '/assets/figma/ai-hero-section.png',
  description: 'High-quality wireless headphones with deep bass and noise cancellation. Enjoy music in style with our signature orange and black design.',
  rating: 4.7,
};

const relatedProducts = [
  { id: 2, name: 'Black Sneakers', price: 89, image: '/assets/figma/discover-section.png' },
  { id: 3, name: 'Smart Watch', price: 149, image: '/assets/figma/ai-hero-section.png' },
  { id: 4, name: 'Wireless Speaker', price: 120, image: '/assets/figma/discover-section.png' },
];

export default function ProductDetail() {
  return (
    <div className="product-detail-page">
      <NavBar />
      <section className="product-detail-main">
        <motion.div className="product-detail-image-wrapper" whileHover={{ scale: 1.05 }}>
          <img className="product-detail-image" src={product.image} alt={product.name} />
        </motion.div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-desc">{product.description}</p>
          <div className="product-detail-price">${product.price}</div>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </section>
      <section className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-grid">
          {relatedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
} 