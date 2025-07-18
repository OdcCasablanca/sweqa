import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Paper, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductGrid from '../components/ProductGrid';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { storeSlug } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        let res;
        if (storeSlug) {
          res = await axiosInstance.get(`/products/store/${storeSlug}`);
        } else {
          res = await axiosInstance.get('/products');
        }
        setProducts(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeSlug]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (id) => {
    if (storeSlug) {
      console.log('Navigating to:', `/store/${storeSlug}/product/${id}`);
      navigate(`/store/${storeSlug}/product/${id}`);
    } else {
      console.log('Navigating to:', `/product/${id}`);
      navigate(`/product/${id}`);
    }
  };

  return (
    <Box sx={{ bgcolor: '#fcf6ee', minHeight: '100vh' }}>
      <NavBar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', pt: 0, pb: 2 }}>
        <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
          Products
        </Typography>
        <Paper sx={{ mb: 4, p: 2, maxWidth: 500, mx: 'auto', borderRadius: 3, boxShadow: 1 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={{ bgcolor: '#fff', borderRadius: 2 }}
          />
        </Paper>
        {error && (
          <Typography color="error" textAlign="center" mb={2}>{error}</Typography>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductGrid products={filteredProducts} onEdit={() => {}} onDelete={() => {}} onView={handleView} />
        )}
      </Box>
      <Footer />
    </Box>
  );
} 