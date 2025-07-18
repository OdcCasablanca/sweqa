import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    IconButton,
    Alert
} from '@mui/material';
import { PhotoCamera, Clear } from '@mui/icons-material';
import axiosInstance from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const navigate = useNavigate();
    const { storeId, productId } = useParams();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        colors: [],
        sizes: [],
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Available options for colors and sizes
    const availableColors = [
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
        { name: 'Green', value: '#00FF00' },
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Yellow', value: '#FFFF00' },
        { name: 'Purple', value: '#800080' },
        { name: 'Orange', value: '#FFA500' },
        { name: 'Gray', value: '#808080' }
    ];

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    useEffect(() => {
        fetchProductAndCategories();
    }, [productId]);

    const fetchProductAndCategories = async () => {
        try {
            const [productRes, categoriesRes] = await Promise.all([
                axiosInstance.get(`/products/${productId}`),
                axiosInstance.get('/categories')
            ]);

            const product = productRes.data;
            console.log('Fetched product:', product); // Debug log
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category?._id || '',
                stock: product.stock,
                // colors and sizes are now per-image, so remove from here
            });

            // Set up existing images
            setPreviewImages(product.images?.map(img => ({
                url: img.url,
                color: img.color || '',
                isMain: img.isMain || false,
                public_id: img.public_id, // Keep track of existing images
                sizes: img.sizes || []
            })) || []);

            setCategories(categoriesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product data:', error);
            setError('Error fetching product data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleColorChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData(prev => ({
            ...prev,
            colors: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleSizeChange = (event) => {
        const {
            target: { value },
        } = event;
        setFormData(prev => ({
            ...prev,
            sizes: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + previewImages.length > 10) {
            setError('Maximum 10 images allowed');
            return;
        }

        setImages([...images, ...files]);

        // Create preview URLs for new images
        const newPreviewImages = files.map(file => ({
            url: URL.createObjectURL(file),
            color: '',
            isMain: false,
            sizes: []
        }));
        setPreviewImages([...previewImages, ...newPreviewImages]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviewImages = [...previewImages];
        
        // If it's a new image (has no public_id), revoke the URL
        if (!previewImages[index].public_id) {
            URL.revokeObjectURL(previewImages[index].url);
        }
        
        newImages.splice(index, 1);
        newPreviewImages.splice(index, 1);
        setImages(newImages);
        setPreviewImages(newPreviewImages);
    };

    const handleImageColorChange = (index, color) => {
        const newPreviewImages = [...previewImages];
        newPreviewImages[index].color = color;
        setPreviewImages(newPreviewImages);
    };

    const setMainImage = (index) => {
        const newPreviewImages = previewImages.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        setPreviewImages(newPreviewImages);
    };

    const handleImageSizesChange = (index, sizes) => {
        const newPreviewImages = [...previewImages];
        newPreviewImages[index].sizes = sizes;
        setPreviewImages(newPreviewImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (previewImages.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        try {
            const formDataToSend = new FormData();
            
            // Append product data
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);

            // Append existing images data
            const existingImages = previewImages
                .filter(img => img.public_id)
                .map(img => ({
                    url: img.url,
                    public_id: img.public_id,
                    color: img.color || '',
                    isMain: img.isMain || false,
                    sizes: img.sizes || []
                }));
            formDataToSend.append('existingImages', JSON.stringify(existingImages));

            // Debug: log all FormData entries before sending
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            // Append new images with their metadata
            images.forEach((image, index) => {
                formDataToSend.append('images', image);
                // Find the preview image that matches this file
                const previewIndex = previewImages.findIndex(p => p.url === URL.createObjectURL(image));
                if (previewIndex !== -1) {
                    const meta = previewImages[previewIndex];
                    if (meta) {
                        formDataToSend.append(`imageMetadata${index}`, JSON.stringify({
                            color: meta.color || '',
                            isMain: meta.isMain || false,
                            sizes: meta.sizes || []
                        }));
                    }
                }
            });

            await axiosInstance.put(`/products/${productId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clean up preview URLs for new images
            previewImages
                .filter(img => !img.public_id)
                .forEach(img => URL.revokeObjectURL(img.url));
            
            navigate(`/store-admin/${storeId}/products`);
        } catch (error) {
            console.error('Error updating product:', error);
            setError(error.response?.data?.message || 'Error updating product');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 3 }}>
                Edit Product
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ 
                                p: 3, 
                                border: '2px dashed #FF6B00',
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 107, 0, 0.05)',
                                mb: 3,
                                textAlign: 'center'
                            }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="image-upload">
                                    <Button
                                        component="span"
                                        variant="contained"
                                        startIcon={<PhotoCamera />}
                                        sx={{ 
                                            bgcolor: '#FF6B00',
                                            '&:hover': { bgcolor: '#cc5500' }
                                        }}
                                    >
                                        Upload Images (Max 10)
                                    </Button>
                                </label>
                                <Grid container spacing={0} sx={{ mt: 2 }}>
                                    {previewImages.map((preview, index) => {
                                        console.log('Image preview URL:', preview.url); // Debug log
                                        return (
                                            <Grid item xs={6} sm={4} md={3} key={index}>
                                                <Paper
                                                    sx={{
                                                        position: 'relative',
                                                        p: 0,
                                                        bgcolor: '#fff',
                                                        border: preview.isMain ? '2px solid #FF6B00' : '1px solid #333'
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeImage(index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: 'rgba(0,0,0,0.5)',
                                                            color: '#fff',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255,0,0,0.5)'
                                                            }
                                                        }}
                                                    >
                                                        <Clear />
                                                    </IconButton>
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            height: 200,
                                                            overflow: 'hidden',
                                                            borderRadius: 1,
                                                            mb: 1,
                                                            m: 0,
                                                            p: 0,
                                                            background: '#ffe0e0'
                                                        }}
                                                    >
                                                        <img
                                                            src={preview.url}
                                                            alt={`Preview ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                margin: 0,
                                                                padding: 0
                                                            }}
                                                        />
                                                    </Box>
                                                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                                                        <InputLabel>
                                                            Color
                                                        </InputLabel>
                                                        <Select
                                                            value={preview.color || ''}
                                                            onChange={(e) => handleImageColorChange(index, e.target.value)}
                                                            label="Color"
                                                        >
                                                            <MenuItem value="">None</MenuItem>
                                                            {availableColors.map((color) => (
                                                                <MenuItem key={color.value} value={color.value}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Box
                                                                            sx={{
                                                                                width: 20,
                                                                                height: 20,
                                                                                borderRadius: '50%',
                                                                                bgcolor: color.value,
                                                                                border: '1px solid #666'
                                                                            }}
                                                                        />
                                                                        {color.name}
                                                                    </Box>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                                                        <InputLabel>Sizes</InputLabel>
                                                        <Select
                                                            multiple
                                                            value={preview.sizes || []}
                                                            onChange={e => handleImageSizesChange(index, e.target.value)}
                                                            label="Sizes"
                                                        >
                                                            {availableSizes.map((size) => (
                                                                <MenuItem key={size} value={size}>{size}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <Button
                                                        fullWidth
                                                        size="small"
                                                        variant={preview.isMain ? "contained" : "outlined"}
                                                        onClick={() => setMainImage(index)}
                                                        sx={{
                                                            bgcolor: preview.isMain ? '#FF6B00' : 'transparent',
                                                            borderColor: '#FF6B00',
                                                            color: preview.isMain ? '#FFFFFF' : '#FF6B00',
                                                            '&:hover': {
                                                                bgcolor: preview.isMain ? '#cc5500' : 'rgba(255, 107, 0, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        {preview.isMain ? 'Main Image' : 'Set as Main'}
                                                    </Button>
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                multiline
                                rows={4}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>
                                    Category
                                </InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    label="Category"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    bgcolor: '#FF6B00',
                                    '&:hover': { bgcolor: '#cc5500' },
                                    mt: 2
                                }}
                            >
                                Update Product
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default EditProduct; 