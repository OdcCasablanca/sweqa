import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Container, Avatar, Badge, Drawer, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Button, Link } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { useParams, Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';

const StoreBanner = ({ store }) => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);
    const [logoError, setLogoError] = useState(false);
    const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const navigate = useNavigate();
    const { storeSlug } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannersResponse = await axiosInstance.get(`/banners/store/${store._id}`);
                setBanners(bannersResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Error loading data');
            }
        };

        if (store._id) {
            fetchData();
        }
    }, [store._id]);

    // Reset logo error when store changes
    useEffect(() => {
        setLogoError(false);
    }, [store]);

    const getLogoUrl = (logoPath) => {
        if (!logoPath) return '/default-store-logo.png';
        if (logoPath.startsWith('http')) return logoPath;
        if (logoPath.startsWith('/')) return process.env.REACT_APP_API_URL + logoPath;
        return process.env.REACT_APP_API_URL + '/' + logoPath;
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        if (banners.length <= 1) return;
        
        const timer = setInterval(handleNext, 5005);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (!store) return null;

    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 0,
            mt: 0,
            pt: 0,
            pb: 0
        }}>
            <Container maxWidth="lg" sx={{ mt: 0, mb: 0, pt: 0, pb: 0 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 0,
                    mt: 0,
                    mb: 0,
                    justifyContent: 'space-between'
                }}>
                    <Link component={RouterLink} to={`/store/${store.slug}`} sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={logoError ? '/default-store-logo.png' : getLogoUrl(store.logo)}
                            alt={store.name}
                            onError={() => setLogoError(true)}
                            sx={{
                                width: 80,
                                height: 80,
                                border: '2px solid #FF6B00'
                            }}
                        />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                                {store.name}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: '#666666' }}>
                                {store.description}
                            </Typography>
                        </Box>
                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton color="primary" onClick={() => setWishlistOpen(true)}>
                            <Badge badgeContent={wishlistItems.length} color="secondary">
                                <FaHeart />
                            </Badge>
                        </IconButton>
                        <IconButton color="primary" onClick={() => setCartOpen(true)}>
                            <Badge badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} color="primary">
                                <FaShoppingCart />
                            </Badge>
                        </IconButton>
                    </Box>
                </Box>
            </Container>
            {/* Cart Drawer */}
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
                            <React.Fragment key={item.id + '-' + (item.selectedColor || '') + '-' + (item.selectedSize || '')}>
                                <ListItem>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`$${item.price.toFixed(2)} x ${item.quantity}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => updateQuantity(item.id, -1, item.selectedColor, item.selectedSize)} size="small">
                                            <RemoveIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => updateQuantity(item.id, 1, item.selectedColor, item.selectedSize)} size="small">
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)} size="small">
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
            {/* Wishlist Drawer */}
            <Drawer anchor="right" open={wishlistOpen} onClose={() => setWishlistOpen(false)}>
                <Box sx={{ width: 350, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Wishlist</Typography>
                        <IconButton onClick={() => setWishlistOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {wishlistItems.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`$${item.price.toFixed(2)}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => moveToCart(item)} size="small">
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => removeFromWishlist(item.id)} size="small">
                                            <CloseIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

StoreBanner.propTypes = {
    store: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        logo: PropTypes.string,
        description: PropTypes.string,
        slug: PropTypes.string.isRequired
    }).isRequired
};

export default StoreBanner; 