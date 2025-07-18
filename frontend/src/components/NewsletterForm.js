import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './NewsletterForm.css';

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setEmail('');
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <motion.button
        type="submit"
        whileTap={{ scale: 0.95 }}
        className="newsletter-btn"
      >
        Subscribe
      </motion.button>
      {submitted && <motion.div className="newsletter-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Thank you for subscribing!</motion.div>}
    </form>
  );
} 