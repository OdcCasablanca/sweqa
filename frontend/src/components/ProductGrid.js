import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  CardActions,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const ProductGrid = ({ products, onEdit, onDelete, onView }) => {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card
            onClick={() => onView(product._id)}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#000000',
              color: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={product.images?.[0]?.url || '/placeholder.png'}
              alt={product.name}
              sx={{
                objectFit: 'cover',
                borderBottom: '2px solid #FF6B00',
              }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#FFFFFF' }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#FF6B00',
                    fontWeight: 'bold',
                  }}
                >
                  ${product.price}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: '#999' }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={product.category?.name || 'Uncategorized'}
                  size="small"
                  sx={{
                    bgcolor: '#FF6B00',
                    color: '#FFFFFF',
                  }}
                />
                <Chip
                  label={`${product.stock} in stock`}
                  size="small"
                  sx={{
                    bgcolor: product.stock > 0 ? '#4CAF50' : '#f44336',
                    color: '#FFFFFF',
                  }}
                />
              </Box>
            </CardContent>

            <CardActions sx={{ p: 2, borderTop: '1px solid #333' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Edit Product">
                  <IconButton
                    onClick={e => { e.stopPropagation(); onEdit(product._id); }}
                    sx={{
                      color: '#FF6B00',
                      '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Product">
                  <IconButton
                    onClick={e => { e.stopPropagation(); onDelete(product._id); }}
                    sx={{
                      color: '#FF6B00',
                      '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid; 