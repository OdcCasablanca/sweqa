import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';
import './StoreNavbar.css';
import { useCart } from '../contexts/CartContext';
import { Drawer, IconButton, Badge, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Typography, Box, Button } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StoreNavbar = () => {
  const { storeSlug } = useParams();
  const [storeInfo, setStoreInfo] = useState({ name: '', logo: '/store-logo.png' });
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = `/store/${storeSlug}`;
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('StoreNavbar useEffect triggered, storeSlug:', storeSlug);
    const fetchStoreInfo = async () => {
      try {
        const response = await axiosInstance.get(`/stores/slug/${storeSlug}`);
        if (response.data) {
          setStoreInfo({
            name: response.data.name,
            logo: response.data.logo || '/store-logo.png'
          });
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    if (storeSlug) {
      fetchStoreInfo();
    }
  }, [storeSlug]);

  // Debug: Log every render
  console.log('StoreNavbar render, storeSlug:', storeSlug);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `${baseUrl}/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <nav className="store-navbar">
        <div className="store-navbar-container">
          <Link to={baseUrl} className="store-logo">
            <img 
              src={storeInfo.logo} 
              alt={storeInfo.name} 
              className="store-nav-logo"
              onError={(e) => {
                e.target.src = '/store-logo.png';
                e.target.onerror = null;
              }}
            />
            <span className="store-name">{storeInfo.name}</span>
          </Link>

          <div className="store-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search in store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
          
          <ul className="store-nav-menu">
            <li className="store-nav-item">
              <Link to={baseUrl} className="store-nav-link">Home</Link>
            </li>
            <li className="store-nav-item">
              <Link to={`${baseUrl}/products`} className="store-nav-link">Products</Link>
            </li>
            <li className="store-nav-item">
              <Link to={`${baseUrl}/categories`} className="store-nav-link">Categories</Link>
            </li>
            <li className="store-nav-item">
              <Link to={`${baseUrl}/about`} className="store-nav-link">About</Link>
            </li>
          </ul>

          <div className="store-nav-icons">
            <Link to={`${baseUrl}/wishlist`} className="store-icon-link" title="Wishlist">
              <FaHeart className="store-nav-icon" />
              <span className="store-icon-text">Wishlist</span>
            </Link>
            <IconButton color="primary" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} color="primary">
                <FaShoppingCart className="store-nav-icon" />
              </Badge>
              <span className="store-icon-text">Cart</span>
            </IconButton>
          </div>
        </div>
      </nav>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 350, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Shopping Cart</Typography>
            <IconButton onClick={() => setCartOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price.toFixed(2)} x ${item.quantity}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => updateQuantity(item.id, -1)} size="small">
                      <RemoveIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => updateQuantity(item.id, 1)} size="small">
                      <AddIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => removeFromCart(item.id)} size="small">
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Total: ${getCartTotal().toFixed(2)}</Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={cartItems.length === 0}
              onClick={() => { setCartOpen(false); navigate(`/store/${storeSlug}/cart`); }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default StoreNavbar; 