import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  Rating,
  Avatar
} from '@mui/material';
import axiosInstance from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';
import StoreBanner from './StoreBanner';
import { useCart } from '../contexts/CartContext';
import StarIcon from '@mui/icons-material/Star';

const mockProducts = [
  {
    _id: '1',
    name: 'Orange Headphones',
    price: 199,
    images: [{ url: '/assets/figma/ai-hero-section.png', color: 'orange', sizes: ['M', 'L'] }],
    description: 'High-quality wireless headphones with deep bass and noise cancellation.',
    category: { name: 'Electronics' },
    stock: 12,
    rating: 4.7,
  },
  {
    _id: '2',
    name: 'Black Sneakers',
    price: 89,
    images: [{ url: '/assets/figma/discover-section.png', color: 'black', sizes: ['42', '43'] }],
    description: 'Comfortable and stylish sneakers for everyday wear.',
    category: { name: 'Shoes' },
    stock: 5,
    rating: 4.2,
  },
  {
    _id: '3',
    name: 'Smart Watch',
    price: 149,
    images: [{ url: '/assets/figma/ai-hero-section.png', color: 'gray', sizes: [] }],
    description: 'Track your fitness and notifications with this modern smart watch.',
    category: { name: 'Wearables' },
    stock: 0,
    rating: 4.8,
  },
];

const ProductDetails = () => {
  const { id, storeSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [store, setStore] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0].url);
          setSelectedColor(res.data.images[0].color || '');
          setSelectedSize(res.data.images[0].sizes?.[0] || '');
        }
      } catch (err) {
        // Fallback to mock data if backend fails
        const mock = mockProducts.find(p => p._id === id);
        setProduct(mock || null);
        if (mock && mock.images && mock.images.length > 0) {
          setMainImage(mock.images[0].url);
          setSelectedColor(mock.images[0].color || '');
          setSelectedSize(mock.images[0].sizes?.[0] || '');
        }
      }
    };
    const fetchStore = async () => {
      if (storeSlug) {
        const res = await axiosInstance.get(`/stores/slug/${storeSlug}`);
        setStore(res.data);
      }
    };
    fetchProduct();
    fetchStore();
  }, [id, storeSlug]);

  if (!product) return <Box p={4}><Typography>Loading...</Typography></Box>;

  console.log('Product images:', product.images);

  // Get unique colors and sizes from images
  const availableColors = Array.from(new Set(product.images.map(img => img.color).filter(Boolean)));
  const availableSizes = Array.from(new Set(product.images.flatMap(img => img.sizes || [])));

  // Filter images by selected color
  const colorImages = product.images; // Always show all images as thumbnails

  // Add a mock rating for demo
  const rating = product.rating || 4.7;

  const handleAddToCart = () => {
    // Add selected color/size to cart item
    addToCart({
      ...product,
      selectedColor,
      selectedSize,
      image: mainImage,
      id: product._id // CartContext expects id
    });
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      selectedColor,
      selectedSize,
      image: mainImage,
      id: product._id
    });
    navigate(`/store/${storeSlug}/cart`);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 4 } }}>
      {store && <StoreBanner store={store} />}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={6} alignItems="flex-start">
          {/* Images + Gallery */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, mb: 2, textAlign: 'center', bgcolor: '#fff7ef' }}>
              <img
                src={mainImage}
                alt={product.name}
                style={{ width: '100%', maxHeight: 420, objectFit: 'contain', borderRadius: 16, boxShadow: '0 4px 24px #ff880033' }}
              />
            </Paper>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              {colorImages.map((img, idx) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={`thumb-${idx}`}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: mainImage === img.url ? '2px solid #FF6B00' : '1px solid #eee', cursor: 'pointer', boxShadow: mainImage === img.url ? '0 0 8px #FF6B0033' : 'none' }}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </Box>
          </Grid>
          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={800} mb={1} sx={{ color: '#231f20' }}>{product.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#FF6B00', mr: 2 }}>${product.price}</Typography>
              <Chip icon={<StarIcon sx={{ color: '#FFD700' }} />} label={rating} sx={{ bgcolor: '#fffbe6', color: '#231f20', fontWeight: 600, fontSize: 18, ml: 1 }} />
              {product.stock > 0 ? (
                <Chip label="In Stock" sx={{ bgcolor: '#4CAF50', color: '#fff', ml: 2, fontWeight: 600 }} />
              ) : (
                <Chip label="Out of Stock" sx={{ bgcolor: '#f44336', color: '#fff', ml: 2, fontWeight: 600 }} />
              )}
            </Box>
            <Typography variant="body1" color="text.secondary" mb={3} sx={{ fontSize: 18 }}>{product.description}</Typography>
            {/* Color selection */}
            {availableColors.length > 0 && <>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Color:</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                {availableColors.map(color => (
                  <Box
                    key={color}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: color,
                      border: selectedColor === color ? '3px solid #FF6B00' : '2px solid #ccc',
                      cursor: 'pointer',
                      boxShadow: selectedColor === color ? '0 0 0 3px #FF6B0033' : 'none',
                      transition: 'border 0.2s, box-shadow 0.2s',
                    }}
                    onClick={() => {
                      setSelectedColor(color);
                      const firstImg = product.images.find(img => img.color === color);
                      if (firstImg) {
                        setMainImage(firstImg.url);
                        setSelectedSize(firstImg.sizes?.[0] || '');
                      }
                    }}
                  />
                ))}
              </Box>
            </>}
            {/* Size selection */}
            {availableSizes.length > 0 && <>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Size:</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {availableSizes.map(size => (
                  <Chip
                    key={size}
                    label={size}
                    clickable
                    color={selectedSize === size ? 'primary' : 'default'}
                    onClick={() => setSelectedSize(size)}
                    sx={{ fontWeight: 600, fontSize: 18, px: 2, py: 1, borderRadius: 2 }}
                  />
                ))}
              </Box>
            </>}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" size="large" sx={{ bgcolor: '#FF6B00', fontWeight: 700, fontSize: 18, px: 4, py: 1.5, borderRadius: 3, boxShadow: '0 2px 8px #ff880033' }} onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outlined" size="large" sx={{ color: '#FF6B00', borderColor: '#FF6B00', fontWeight: 700, fontSize: 18, px: 4, py: 1.5, borderRadius: 3 }} onClick={handleBuyNow}>
                Buy Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetails; 