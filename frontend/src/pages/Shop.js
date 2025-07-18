import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import Footer from '../components/Footer';
import './Shop.css';

const allProducts = [
  { id: 1, name: 'Orange Headphones', price: 199, image: '/assets/figma/ai-hero-section.png', category: 'Tech', rating: 4.5 },
  { id: 2, name: 'Black Sneakers', price: 89, image: '/assets/figma/discover-section.png', category: 'Fashion', rating: 4.2 },
  { id: 3, name: 'Smart Watch', price: 149, image: '/assets/figma/ai-hero-section.png', category: 'Tech', rating: 4.8 },
  { id: 4, name: 'Wireless Speaker', price: 120, image: '/assets/figma/discover-section.png', category: 'Tech', rating: 4.1 },
  { id: 5, name: 'Orange Hoodie', price: 59, image: '/assets/figma/ai-hero-section.png', category: 'Fashion', rating: 4.7 },
  { id: 6, name: 'Coffee Maker', price: 99, image: '/assets/figma/discover-section.png', category: 'Home', rating: 4.3 },
];

export default function Shop() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'All', price: [0, 200], rating: 0 });

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filters.category === 'All' || p.category === filters.category;
    const matchesPrice = p.price >= filters.price[0] && p.price <= filters.price[1];
    const matchesRating = p.rating >= filters.rating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <div className="shop-page">
      <NavBar />
      <section className="shop-controls">
        <input
          className="shop-search"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <FilterBar filters={filters} setFilters={setFilters} />
      </section>
      <motion.section className="shop-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.section>
      <Footer />
    </div>
  );
} 