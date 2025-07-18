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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    Chip,
    CircularProgress
} from '@mui/material';
import { PhotoCamera, Clear, CloudUpload, ShoppingCart, Check } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateProduct = ({ onProductCreated }) => {
    const navigate = useNavigate();
    const { storeId } = useParams();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        colors: [],
        stock: '',
        storeId: storeId
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [openSuggestionDialog, setOpenSuggestionDialog] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedPreviewColor, setSelectedPreviewColor] = useState('');
    const [selectedPreviewSizes, setSelectedPreviewSizes] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Available options for colors
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

    // Add availableSizes array
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    // Add this near your other styles
    const loaderStyles = {
        position: 'relative',
        width: '100%',
        height: '120px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        padding: '20px'
    };

    const cartAnimation = {
        '@keyframes moveCart': {
            '0%': { transform: 'translateX(-150%)' },
            '50%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(150%)' }
        },
        animation: 'moveCart 1.5s infinite ease-in-out'
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:5005/api/categories/store/${storeId}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories');
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

    // Function to get unique colors from preview images
    const getUniqueColors = () => {
        const colors = new Set();
        previewImages.forEach(img => {
            if (img.color) colors.add(img.color);
        });
        return Array.from(colors);
    };

    // Update handleImageChange to initialize color and size
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 10) {
            setError('Maximum 10 images allowed');
            return;
        }

        setImages([...images, ...files]);
        setIsAnalyzing(true);

        // Create preview URLs for all images
        const newPreviewImages = files.map(file => ({
            url: URL.createObjectURL(file),
            color: '',
            size: '',
            isMain: previewImages.length === 0 // First image is main by default
        }));
        setPreviewImages([...previewImages, ...newPreviewImages]);

        try {
            // Only analyze the first image if it's the first upload
            if (files[0] && images.length === 0) {
                const base64Image = await convertFileToBase64(files[0]);
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:5005/api/products/analyze-image', {
                    image: base64Image
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('API Response:', response.data);

                // Extract suggestions from the nested response
                const apiSuggestions = response.data.suggestions;
                
                if (apiSuggestions && (apiSuggestions.name || apiSuggestions.description)) {
                    const suggestions = {
                        name: apiSuggestions.name || '',
                        description: apiSuggestions.description || ''
                    };

                    // Only show dialog if we have actual suggestions
                    if (suggestions.name || suggestions.description) {
                        setSuggestions(suggestions);
                        setOpenSuggestionDialog(true);
                    }
                }
            }
        } catch (error) {
            console.error('Error analyzing image:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                setError(`Failed to analyze image: ${error.response.data.message || 'Unknown error'}`);
            } else {
                setError('Failed to analyze image. Please try again.');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const removeImage = (index) => {
        const newImages = [...images];
        const newPreviewImages = [...previewImages];
        
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(previewImages[index].url);
        
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

    const handleImageSizeChange = (index, size) => {
        const newPreviewImages = [...previewImages];
        newPreviewImages[index].size = size;
        setPreviewImages(newPreviewImages);
    };

    const setMainImage = (index) => {
        const newPreviewImages = previewImages.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        setPreviewImages(newPreviewImages);
    };

    // Update the preview section in the render part
    const ImagePreviewSection = () => (
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {previewImages.map((img, index) => (
                <Paper
                    key={index}
                    elevation={img.isMain ? 3 : 1}
                    sx={{
                        position: 'relative',
                        width: 200,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: img.isMain ? '2px solid #FF6B00' : '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', height: 200 }}>
                        <img
                            src={img.url}
                            alt={`Preview ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                            }}
                        >
                            <Clear />
                        </IconButton>
                    </Box>
                    <Box sx={{ mt: 2 }} />
                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                        <Select
                            value={img.color}
                            onChange={(e) => handleImageColorChange(index, e.target.value)}
                            displayEmpty
                            renderValue={(selected) => (
                                selected ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                bgcolor: availableColors.find(c => c.name === selected)?.value || selected,
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                        {selected}
                                    </Box>
                                ) : <em>Select Color</em>
                            )}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {availableColors.map((color) => (
                                <MenuItem key={color.name} value={color.name}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                bgcolor: color.value,
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                        {color.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                        <Select
                            value={img.size}
                            onChange={(e) => handleImageSizeChange(index, e.target.value)}
                            displayEmpty
                            renderValue={(selected) => selected ? selected : <em>Select Size</em>}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {availableSizes.map((size) => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        fullWidth
                        size="small"
                        variant={img.isMain ? "contained" : "outlined"}
                        onClick={() => setMainImage(index)}
                        sx={{
                            bgcolor: img.isMain ? '#FF6B00' : 'transparent',
                            color: img.isMain ? 'white' : '#FF6B00',
                            '&:hover': {
                                bgcolor: img.isMain ? '#ff8533' : 'rgba(255, 107, 0, 0.1)'
                            }
                        }}
                    >
                        {img.isMain ? 'Main Image' : 'Set as Main'}
                    </Button>
                </Paper>
            ))}
        </Box>
    );

    // Function to get images for a specific color
    const getImagesForColor = (color) => {
        return previewImages.filter(img => img.color === color);
    };

    // Update handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (images.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        if (!formData.category) {
            setError('Please select a category.');
            return;
        }

        setIsCreating(true);

        try {
            const formDataToSend = new FormData();
            // Get unique colors from images
            const availableColors = getUniqueColors();

            // Append product data
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('storeId', storeId);
            formDataToSend.append('colors', JSON.stringify(availableColors));
            formDataToSend.append('stock', formData.stock);

            // Append images with their metadata
            images.forEach((image, index) => {
                formDataToSend.append('images', image);
                formDataToSend.append(`imageMetadata${index}`, JSON.stringify({
                    color: previewImages[index].color,
                    size: previewImages[index].size,
                    isMain: previewImages[index].isMain
                }));
            });

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5005/api/products', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (onProductCreated) {
                // Hydrate the category field with the full object
                const categoryObj = categories.find(cat => cat._id === response.data.category);
                onProductCreated({
                  ...response.data,
                  category: categoryObj || response.data.category
                });
            }
            navigate(`/store-admin/${storeId}/products`);
        } catch (error) {
            console.error('Error creating product:', error);
            setError(error.response?.data?.message || 'Error creating product');
        } finally {
            setIsCreating(false);
        }
    };

    const handleSuggestionApply = () => {
        if (suggestions) {
            setFormData(prev => ({
                ...prev,
                name: suggestions.name || prev.name,
                description: suggestions.description || prev.description
            }));
        }
        setOpenSuggestionDialog(false);
    };

    const SuggestionDialog = () => (
        <Dialog
            open={Boolean(openSuggestionDialog)}
            onClose={() => setOpenSuggestionDialog(false)}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '400px',
                    width: '100%'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    color: '#1a1a1a', 
                    pb: 1,
                    borderBottom: '1px solid #e0e0e0'
                }}
            >
                Product Suggestions
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {suggestions && (
                    <Box sx={{ py: 1 }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                color: '#666', 
                                mb: 2,
                                fontWeight: 500 
                            }}
                        >
                            Based on your product image, we suggest:
                        </Typography>
                        
                        <Paper 
                            sx={{ 
                                p: 2, 
                                bgcolor: 'rgba(255, 107, 0, 0.05)', 
                                borderRadius: 2,
                                mb: 2,
                                border: '1px solid rgba(255, 107, 0, 0.1)'
                            }}
                        >
                            {suggestions.name && (
                                <Box sx={{ mb: suggestions.description ? 2 : 0 }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#666',
                                            mb: 0.5 
                                        }}
                                    >
                                        Suggested Name:
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: 500,
                                            color: '#1a1a1a'
                                        }}
                                    >
                                        {suggestions.name}
                                    </Typography>
                                </Box>
                            )}

                            {suggestions.description && (
                                <Box>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#666',
                                            mb: 0.5 
                                        }}
                                    >
                                        Suggested Description:
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: '#1a1a1a',
                                            lineHeight: 1.6 
                                        }}
                                    >
                                        {suggestions.description}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Would you like to use these suggestions?
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button
                    onClick={() => setOpenSuggestionDialog(false)}
                    sx={{ 
                        color: '#666666',
                        '&:hover': { bgcolor: '#f5f5f5' },
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Ignore
                </Button>
                <Button
                    onClick={handleSuggestionApply}
                    variant="contained"
                    sx={{
                        bgcolor: '#FF6B00',
                        '&:hover': { bgcolor: '#ff8533' },
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                        fontWeight: 500
                    }}
                >
                    Apply Suggestions
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Preview Modal Component
    const PreviewModal = () => {
        const { colors } = getUniqueColors();

        return (
            <Dialog
                open={Boolean(showPreviewModal)}
                maxWidth="md"
                fullWidth
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        backgroundImage: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        pb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Check sx={{ color: '#4CAF50' }} />
                    Product Created Successfully
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Grid container>
                        {/* Image Section */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: '100%',
                                    minHeight: 400,
                                    bgcolor: '#f5f5f5'
                                }}
                            >
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt={formData.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>

                        {/* Details Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    {formData.name}
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                                    {formData.description}
                                </Typography>

                                <Typography variant="h6" sx={{ mb: 2, color: '#FF6B00', fontWeight: 600 }}>
                                    ${formData.price}
                                </Typography>

                                {/* Color Selection */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                                        Available Colors:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {(Array.isArray(colors) ? colors : []).map((color) => {
                                            const colorValue = (Array.isArray(availableColors) ? availableColors : []).find(c => c.name === color)?.value || color;
                                            return (
                                                <Box
                                                    key={color}
                                                    onClick={() => {
                                                        setSelectedPreviewColor(color);
                                                        const newImage = getImagesForColor(color)[0]?.url;
                                                        if (newImage) setPreviewImage(newImage);
                                                    }}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        bgcolor: colorValue,
                                                        border: selectedPreviewColor === color 
                                                            ? '2px solid #FF6B00' 
                                                            : '1px solid #e0e0e0',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#666' }}>
                                        Stock Available: {formData.stock} units
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <Button
                        onClick={() => {
                            setShowPreviewModal(false);
                            navigate(`/store-admin/${storeId}/products`);
                        }}
                        variant="contained"
                        sx={{
                            bgcolor: '#FF6B00',
                            '&:hover': { bgcolor: '#ff8533' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 4,
                            py: 1
                        }}
                    >
                        Continue to Products
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            <SuggestionDialog />
            <PreviewModal />
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    bgcolor: 'transparent',
                    py: 2,
                }}
            >
                <Typography variant="h5" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
                Create New Product
            </Typography>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
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
                                        startIcon={<CloudUpload />}
                                        sx={{ 
                                            bgcolor: '#FF6B00',
                                            '&:hover': { bgcolor: '#cc5500' }
                                        }}
                                    >
                                        Upload Images
                                    </Button>
                                </label>
                                {isAnalyzing && (
                                    <Box sx={loaderStyles}>
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '40px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <ShoppingCart 
                                                sx={{
                                                    position: 'absolute',
                                                    color: '#FF6B00',
                                                    fontSize: '2.5rem',
                                                    ...cartAnimation
                                                }}
                                            />
                                        </Box>
                                        <Typography 
                                            color="textSecondary" 
                                            variant="body1"
                                            sx={{
                                                fontWeight: 500,
                                                color: '#FF6B00'
                                            }}
                                        >
                                            Analyzing your product image...
                                        </Typography>
                                    </Box>
                                )}
                                {previewImages.length > 0 && <ImagePreviewSection />}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#e0e0e0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF6B00'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#666',
                                        '&.Mui-focused': {
                                            color: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#1a1a1a'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#e0e0e0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF6B00'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#666',
                                        '&.Mui-focused': {
                                            color: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#1a1a1a'
                                    }
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#e0e0e0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF6B00'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#666',
                                        '&.Mui-focused': {
                                            color: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#1a1a1a'
                                    }
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#e0e0e0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FF6B00'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#666',
                                        '&.Mui-focused': {
                                            color: '#FF6B00'
                                        }
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#1a1a1a'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel sx={{ color: '#666', '&.Mui-focused': { color: '#FF6B00' } }}>
                                    Category
                                </InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    label="Category"
                                    sx={{
                                        color: '#1a1a1a',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#e0e0e0',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#FF6B00',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#FF6B00',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: '#666',
                                        },
                                    }}
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
                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <Button
                                    onClick={() => navigate(`/store-admin/${storeId}/products`)}
                                        sx={{
                                        color: '#666666',
                                        '&:hover': { bgcolor: '#f5f5f5' },
                                        textTransform: 'none',
                                        }}
                                    >
                                    Cancel
                                    </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: '#FF6B00',
                                        '&:hover': { bgcolor: '#ff8533' },
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        px: 3,
                                }}
                            >
                                Create Product
                            </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {isCreating && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress sx={{ color: '#FF6B00' }} size={60} thickness={5} />
                </Box>
            )}
        </Box>
    );
};

export default CreateProduct; 