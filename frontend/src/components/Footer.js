import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-logo">
          <span className="logo-orange">Sweqa</span><span className="logo-black">Store</span>
        </div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#faq">FAQ</a>
          <a href="#shipping">Shipping Info</a>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="Facebook">📘</a>
        </div>
      </div>
      <div className="footer-newsletter">
        <form>
          <input type="email" placeholder="Subscribe to our newsletter" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
      <div className="footer-copy">&copy; 2024 Sweqa. All rights reserved.</div>
    </footer>
  );
} 