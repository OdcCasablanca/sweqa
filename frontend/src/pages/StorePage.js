import React from 'react';
import './StorePage.css';

const categories = [
  { name: 'Electronics', image: '/assets/figma/electronics.png' },
  { name: 'Fashion', image: '/assets/figma/fashion.png' },
  { name: 'Home', image: '/assets/figma/home.png' },
];

const products = [
  { name: 'Smartphone', price: 499, image: '/assets/figma/ai-hero-section.png' },
  { name: 'Sneakers', price: 89, image: '/assets/figma/discover-section.png' },
  { name: 'Coffee Maker', price: 120, image: '/assets/figma/ai-hero-section.png' },
];

export default function StorePage() {
  return (
    <div className="storepage-root">
      {/* Hero Section */}
      <section className="storepage-hero">
        <div className="storepage-hero-content">
          <h1>Welcome to <span className="storepage-highlight">SweqaStore</span></h1>
          <p>Discover the best products, unbeatable deals, and fast shipping—all in one place.</p>
          <button className="storepage-cta">Shop Now</button>
        </div>
        <img className="storepage-hero-img" src="/assets/figma/ai-hero-section.png" alt="Hero" />
      </section>

      {/* Categories */}
      <section className="storepage-categories">
        <h2>Shop by Category</h2>
        <div className="storepage-category-grid">
          {categories.map(cat => (
            <div className="storepage-category-card" key={cat.name}>
              <img src={cat.image} alt={cat.name} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="storepage-products">
        <h2>Featured Products</h2>
        <div className="storepage-product-grid">
          {products.map(prod => (
            <div className="storepage-product-card" key={prod.name}>
              <img src={prod.image} alt={prod.name} />
              <div className="storepage-product-info">
                <span className="storepage-product-name">{prod.name}</span>
                <span className="storepage-product-price">${prod.price}</span>
              </div>
              <button className="storepage-buy-btn">Buy Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 