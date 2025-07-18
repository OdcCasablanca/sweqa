import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import './HeroSlider.css';

const slides = [
  {
    title: 'Welcome to My Store',
    subtitle: 'Discover the best products, curated just for you.',
    image: '/assets/figma/ai-hero-section.png',
    cta: 'Shop Now',
    ctaLink: '/products',
    bg: 'linear-gradient(120deg, #ff8800 0%, #ffb347 100%)',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Check out the latest trends and exclusive offers.',
    image: '/assets/figma/discover-section.png',
    cta: 'Browse Collection',
    ctaLink: '/products',
    bg: 'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
  },
  {
    title: 'Shop with Confidence',
    subtitle: 'Quality products, fast shipping, and easy returns.',
    image: '/assets/figma/ai-hero-section.png',
    cta: 'Start Shopping',
    ctaLink: '/products',
    bg: 'linear-gradient(120deg, #f857a6 0%, #ff5858 100%)',
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  arrows: false,
  pauseOnHover: true,
};

export default function HeroSlider() {
  return (
    <div className="hero-slider-root">
      <Slider {...sliderSettings}>
        {slides.map((slide, idx) => (
          <div key={idx}>
            <section
              className="hero-slide"
              style={{ background: slide.bg }}
            >
              <div className="hero-slide-content">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="hero-title"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="hero-subtitle"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.a
                  href={slide.ctaLink}
                  className="hero-cta-btn"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {slide.cta}
                </motion.a>
              </div>
              <motion.img
                src={slide.image}
                alt="Hero Visual"
                className="hero-slide-img"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </section>
          </div>
        ))}
      </Slider>
    </div>
  );
} 