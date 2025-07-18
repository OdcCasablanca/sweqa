import React from 'react';
import './FilterBar.css';

const categories = ['All', 'Tech', 'Fashion', 'Home'];
const ratings = [0, 3, 4, 4.5, 5];

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="filter-bar">
      <select
        value={filters.category}
        onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <div className="filter-bar-range">
        <label>Price:</label>
        <input
          type="range"
          min={0}
          max={200}
          value={filters.price[1]}
          onChange={e => setFilters(f => ({ ...f, price: [0, Number(e.target.value)] }))}
        />
        <span>${filters.price[0]} - ${filters.price[1]}</span>
      </div>
      <select
        value={filters.rating}
        onChange={e => setFilters(f => ({ ...f, rating: Number(e.target.value) }))}
      >
        {ratings.map(r => (
          <option key={r} value={r}>{r === 0 ? 'All Ratings' : `${r}+`}</option>
        ))}
      </select>
    </div>
  );
} 