import React, { useState, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import StoreNavbar from '../components/StoreNavbar';
import ProductCard from '../components/ProductCard';
import Testimonial from '../components/Testimonial';
import NewsletterForm from '../components/NewsletterForm';
import Footer from '../components/Footer';
import axiosInstance from '../utils/axiosInstance';
import './StoreFront.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeroSlider from '../components/HeroSlider';
console.log('StoreFront.js loaded!');
const clientLogos = [
  '/assets/figma/ai-hero-section.png',
  '/assets/figma/discover-section.png',
  '/assets/figma/ai-hero-section.png',
];

export default function StoreFront() {
  const { storeSlug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch store data
        const storeResponse = await axiosInstance.get(`/stores/slug/${storeSlug}`);
        const storeData = storeResponse.data;
        setStore(storeData);
        
        // Fetch products for this store
        const productsResponse = await axiosInstance.get(`/products/store/${storeData._id}`);
        setProducts(productsResponse.data);
        
      } catch (error) {
        console.error('Error fetching store data:', error);
        setError(error.response?.data?.message || 'Error loading store');
      } finally {
        setLoading(false);
      }
    };

    if (storeSlug) {
      fetchStoreData();
    }
  }, [storeSlug]);

  if (loading) {
    return (
      <div className="storefront-home">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading store...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="storefront-home">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#ff4444'
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="storefront-home">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Store not found
        </div>
      </div>
    );
  }

  // Get featured products (first 4 products or all if less than 4)
  const featuredProducts = products.slice(0, 4);

  // Get up to 3 hero images for the slider
  const heroImages = products
    .filter(p => p.images && p.images.length > 0)
    .flatMap(p => p.images.map(img => img.url))
    .slice(0, 6);
  if (heroImages.length === 0) {
    heroImages.push('/assets/figma/ai-hero-section.png');
  }

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className="storefront-home">
      <Outlet />
      <StoreNavbar />
      <HeroSlider />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="storefront-featured">
          <h2>Featured Products</h2>
          <div className="storefront-featured-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Client Logos / Testimonials */}
      <section className="storefront-testimonials">
        <h2>Trusted by Top Brands</h2>
        <div className="client-logos">
          {clientLogos.map((logo, idx) => (
            <motion.img key={idx} src={logo} alt="Client Logo" whileHover={{ scale: 1.1 }} />
          ))}
        </div>
        <Testimonial />
      </section>

      {/* Newsletter */}
      <section className="storefront-newsletter">
        <NewsletterForm />
      </section>

      <Footer />
    </div>
  );
} 