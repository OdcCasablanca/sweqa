import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ProductDetails from '../components/ProductDetails';

export default function ProductDetailsPage() {
  return (
    <div style={{ background: '#fcf6ee', minHeight: '100vh' }}>
      <NavBar />
      <ProductDetails />
      <Footer />
    </div>
  );
} 