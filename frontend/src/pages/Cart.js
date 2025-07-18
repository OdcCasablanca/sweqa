import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import './Cart.css';
import StoreNavbar from '../components/StoreNavbar';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  const handleQuantity = (id, delta, selectedColor, selectedSize) => {
    updateQuantity(id, delta, selectedColor, selectedSize);
  };

  const handleRemove = (id, selectedColor, selectedSize) => {
    removeFromCart(id, selectedColor, selectedSize);
  };

  const total = getCartTotal();

  const handleCheckout = () => {
    navigate(`/store/${storeSlug}/checkout`);
  };

  return (
    <>
      <StoreNavbar />
      <div className="cart-page">
        <section className="cart-list">
          <h1>Your Cart</h1>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <motion.div className="cart-items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {cartItems.map(item => (
                <div className="cart-item" key={item.id + (item.selectedColor || '') + (item.selectedSize || '')}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => handleQuantity(item.id, -1, item.selectedColor, item.selectedSize)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, 1, item.selectedColor, item.selectedSize)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item.id, item.selectedColor, item.selectedSize)}>&times;</button>
                </div>
              ))}
            </motion.div>
          )}
          <div className="cart-total">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <button className="checkout-btn" disabled={cartItems.length === 0} onClick={handleCheckout}>Checkout</button>
        </section>
        <Footer />
      </div>
    </>
  );
} 