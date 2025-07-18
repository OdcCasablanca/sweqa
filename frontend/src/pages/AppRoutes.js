import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoreFront from './StoreFront';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Products from './Products';
import ProductDetailsPage from './ProductDetails';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products" element={<Navigate to="/store/my-store/products" replace />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        {/* Store-specific nested routes */}
        <Route path="/store/:storeSlug/*" element={<StoreFront />}>
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          {/* Add more nested store routes here if needed */}
          <Route index element={<StoreFront />} />
        </Route>
      </Routes>
    </Router>
  );
} 