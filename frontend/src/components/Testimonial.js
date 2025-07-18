import React from 'react';
import { motion } from 'framer-motion';
import './Testimonial.css';

const testimonials = [
  {
    name: 'Jane Doe',
    avatar: '/assets/figma/ai-hero-section.png',
    quote: 'SweqaStore has the best products and super fast shipping! Highly recommended.'
  },
  {
    name: 'John Smith',
    avatar: '/assets/figma/discover-section.png',
    quote: 'Amazing customer service and great deals. I love shopping here!'
  },
  {
    name: 'Emily Lee',
    avatar: '/assets/figma/ai-hero-section.png',
    quote: 'The quality is top-notch and the site is so easy to use.'
  }
];

export default function Testimonial() {
  return (
    <div className="testimonial-section">
      {testimonials.map((t, i) => (
        <motion.div
          className="testimonial-card"
          key={t.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <img className="testimonial-avatar" src={t.avatar} alt={t.name} />
          <div className="testimonial-quote">“{t.quote}”</div>
          <div className="testimonial-name">{t.name}</div>
        </motion.div>
      ))}
    </div>
  );
} 