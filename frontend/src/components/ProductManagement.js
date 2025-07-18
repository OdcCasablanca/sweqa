import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Select,
    MenuItem,
    InputAdornment,
    Stack
} from '@mui/material';
import {
    Delete,
    Edit,
    Search,
    Add,
    ShoppingCart,
    LocalOffer
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
    const navigate = useNavigate();
    const { storeId } = useParams();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5005/api/products/store/${storeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDeleteClick = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5005/api/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(products.filter(p => p._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const filteredProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

    return (
        <Box sx={{ 
            p: 3, 
            bgcolor: '#e3f2fd',
            minHeight: '100vh',
            '& .MuiCard-root': {
                bgcolor: '#e3f2fd'
            },
            '& .MuiInputBase-root': {
                bgcolor: '#e3f2fd'
            }
        }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Products
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <TextField
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#e0e0e0' }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#666' }} />
                                </InputAdornment>
                            )
                        }}
                    />
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        displayEmpty
                        sx={{ 
                            minWidth: 200,
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }
                        }}
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="newest">Newest First</MenuItem>
                    </Select>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate(`/store-admin/${storeId}/products/create`)}
                    sx={{
                        bgcolor: '#FF6B00',
                        '&:hover': { bgcolor: '#ff8533' },
                        borderRadius: '8px',
                        textTransform: 'none'
                    }}
                >
                    Add Product
                </Button>
            </Box>

            <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card sx={{ 
                            borderRadius: 2,
                            boxShadow: 'none',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)'
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocalOffer sx={{ color: '#FF6B00', mr: 1, fontSize: 32 }} />
                                    <Typography variant="h6" sx={{ color: '#1a1a1a' }}>
                                        {product.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {product.description || 'No description available'}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#FF6B00',
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    ${product.price} · {product.stock} in stock
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => navigate(`/store-admin/${storeId}/products/edit/${product._id}`)}
                                        sx={{ 
                                            color: '#FF6B00',
                                            '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' }
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteClick(product._id)}
                                        sx={{ 
                                            color: '#FF6B00',
                                            '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' }
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductManagement; 