import React from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, Rating, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '100%', // 1:1 aspect ratio
  position: 'relative',
});

const SaleChip = styled(Chip)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: '#FF6B00',
  color: 'white',
  fontWeight: 600,
});

const FeaturedProducts = ({ products }) => {
  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#1a1a1a' }}>
        Featured Products
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Discover our handpicked selection of premium products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <ProductCard>
              <Box sx={{ position: 'relative' }}>
                <ProductImage
                  image={product.images[0]?.url || '/placeholder.png'}
                  title={product.name}
                />
                {product.onSale && (
                  <SaleChip label="SALE" />
                )}
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="subtitle1" 
                  component={Link} 
                  to={`/product/${product._id}`}
                  sx={{ 
                    color: '#1a1a1a',
                    textDecoration: 'none',
                    '&:hover': { color: '#FF6B00' },
                    mb: 1,
                    fontWeight: 500
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating || 0} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                    ({product.numReviews || 0})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#FF6B00', fontWeight: 600 }}>
                    ${product.price}
                  </Typography>
                  {product.onSale && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textDecoration: 'line-through',
                        color: '#666',
                        ml: 1
                      }}
                    >
                      ${product.originalPrice}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  sx={{
                    mt: 'auto',
                    bgcolor: '#FF6B00',
                    '&:hover': { bgcolor: '#ff8533' },
                    textTransform: 'none',
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </ProductCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts; 