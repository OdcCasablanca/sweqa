import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Dialog,
    DialogContent,
    Alert,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DragHandle as DragHandleIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axiosInstance from '../utils/axios';
import { useParams } from 'react-router-dom';

const BannerManagement = () => {
    const { storeId } = useParams();
    const [banners, setBanners] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, [storeId]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/banners/store/${storeId}`);
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            setError('Error fetching banners. Please try again.');
        } finally {
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleOpenDialog = (banner = null) => {
        if (banner) {
            setFormData({
                title: banner.title,
                image: null
            });
            setPreviewImage(banner.image.url);
            setEditingBanner(banner);
        } else {
            setFormData({
                title: '',
                image: null
            });
            setPreviewImage(null);
            setEditingBanner(null);
        }
        setOpenDialog(true);
        setError('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            title: '',
            image: null
        });
        setPreviewImage(null);
        setEditingBanner(null);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            if (!formData.title.trim()) {
                setError('Title is required');
                return;
            }

            if (!formData.image && !editingBanner) {
                setError('Image is required');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }
            formDataToSend.append('storeId', storeId);

            if (editingBanner) {
                await axiosInstance.put(`/banners/${editingBanner._id}`, formDataToSend);
            } else {
                await axiosInstance.post('/banners', formDataToSend);
            }
            handleCloseDialog();
            await fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            setError(error.response?.data?.message || 'Error saving banner. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bannerId) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/banners/${bannerId}`);
                await fetchBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
                setError(error.response?.data?.message || 'Error deleting banner. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(banners);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setBanners(items);

        try {
            setLoading(true);
            await Promise.all(items.map((banner, index) => 
                axiosInstance.put(`/banners/${banner._id}`, {
                    title: banner.title,
                    order: index
                })
            ));
        } catch (error) {
            console.error('Error updating banner order:', error);
            setError('Error updating banner order. Please try again.');
            await fetchBanners();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress sx={{ color: '#FF6B00' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: '#FF6B00' }}>
                    Banners
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        bgcolor: '#FF6B00',
                        '&:hover': { bgcolor: '#cc5500' }
                    }}
                >
                    Add Banner
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="banners" type="BANNER">
                    {(provided) => (
                        <Grid
                            container
                            spacing={2}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {banners.map((banner, index) => (
                                <Draggable
                                    key={banner._id}
                                    draggableId={banner._id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <Card>
                                                <Box sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={banner.image.url}
                                                        alt={banner.title}
                                                    />
                                                    <IconButton
                                                        {...provided.dragHandleProps}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            left: 8,
                                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                            color: 'white',
                                                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                                                        }}
                                                    >
                                                        <DragHandleIcon />
                                                    </IconButton>
                                                </Box>
                                                <CardContent>
                                                    <Typography variant="h6" noWrap>
                                                        {banner.title}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleOpenDialog(banner)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() => handleDelete(banner._id)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#000000',
                        color: '#FFFFFF'
                    }
                }}
            >
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 3, color: '#FF6B00' }}>
                        {editingBanner ? 'Edit Banner' : 'Add Banner'}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            required
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            fullWidth
                            error={error && error.includes('Title')}
                            helperText={error && error.includes('Title') ? error : ''}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#FF6B00' },
                                    '&:hover fieldset': { borderColor: '#FF6B00' },
                                    '&.Mui-focused fieldset': { borderColor: '#FF6B00' }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#FF6B00'
                                },
                                '& .MuiInputBase-input': {
                                    color: '#FFFFFF'
                                }
                            }}
                        />

                        <Box>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="banner-image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="banner-image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{
                                        color: '#FF6B00',
                                        borderColor: '#FF6B00',
                                        '&:hover': {
                                            borderColor: '#cc5500',
                                            bgcolor: 'rgba(255, 107, 0, 0.1)'
                                        }
                                    }}
                                >
                                    Upload Image
                                </Button>
                            </label>
                            {error && error.includes('Image') && (
                                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            {previewImage && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={handleCloseDialog}
                                disabled={loading}
                                sx={{
                                    color: '#FF6B00',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 107, 0, 0.1)'
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={loading || !formData.title || (!formData.image && !editingBanner)}
                                sx={{
                                    bgcolor: '#FF6B00',
                                    '&:hover': { bgcolor: '#cc5500' },
                                    '&.Mui-disabled': {
                                        bgcolor: 'rgba(255, 107, 0, 0.3)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : (editingBanner ? 'Save' : 'Create')}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BannerManagement; 