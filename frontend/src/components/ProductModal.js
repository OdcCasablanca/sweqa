import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  Dialog,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const ProductModal = ({ productId, open, onClose }) => {
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const fetchProduct = async () => {
      const res = await axiosInstance.get(`/products/${productId}`);
      setProduct(res.data);
      if (res.data.images && res.data.images.length > 0) {
        setMainImage(res.data.images[0].url);
        setSelectedColor(res.data.images[0].color || '');
        setSelectedSize(res.data.images[0].sizes?.[0] || '');
      }
    };
    fetchProduct();
  }, [productId, open]);

  if (!product) return null;

  const availableColors = Array.from(new Set(product.images.map(img => img.color).filter(Boolean)));
  const availableSizes = Array.from(new Set(product.images.flatMap(img => img.sizes || [])));
  const colorImages = selectedColor
    ? product.images.filter(img => img.color === selectedColor)
    : product.images;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container spacing={4}>
          {/* Images */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2, textAlign: 'center' }}>
              <img
                src={mainImage}
                alt={product.name}
                style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8 }}
              />
            </Paper>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {colorImages.map((img, idx) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={`thumb-${idx}`}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: mainImage === img.url ? '2px solid #FF6B00' : '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </Box>
          </Grid>
          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700} mb={2}>{product.name}</Typography>
            <Typography variant="h6" color="#FF6B00" fontWeight={600} mb={2}>${product.price}</Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>{product.description}</Typography>

            {/* Color selection */}
            <Typography variant="subtitle1" fontWeight={500} mb={1}>Color:</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {availableColors.map(color => (
                <Box
                  key={color}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: color,
                    border: selectedColor === color ? '2px solid #FF6B00' : '1px solid #ccc',
                    cursor: 'pointer',
                    boxShadow: selectedColor === color ? '0 0 0 2px #FF6B0033' : 'none',
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

            {/* Size selection */}
            <Typography variant="subtitle1" fontWeight={500} mb={1}>Size:</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {availableSizes.map(size => (
                <Chip
                  key={size}
                  label={size}
                  clickable
                  color={selectedSize === size ? 'primary' : 'default'}
                  onClick={() => setSelectedSize(size)}
                  sx={{ fontWeight: 500, fontSize: 15 }}
                />
              ))}
            </Box>

            <Button variant="contained" size="large" sx={{ bgcolor: '#FF6B00', mr: 2 }}>
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: '#FF6B00', borderColor: '#FF6B00', ml: 2 }}
              onClick={() => {
                onClose();
                navigate(`/store/${product.store}/product/${product._id}`);
              }}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default ProductModal; 