import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const AddBanner = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        image: null
    });

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
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = () => {
        if (formData.title && formData.image) {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('image', formData.image);
            onSubmit(submitData);
            setFormData({
                title: '',
                image: null
            });
        }
    };

    return (
        <Paper 
            elevation={3}
            sx={{ 
                p: 3,
                bgcolor: '#000000',
                color: '#FFFFFF',
                maxWidth: 400,
                mx: 'auto',
                mt: 4
            }}
        >
            <Typography variant="h6" sx={{ mb: 3, color: '#FF6B00' }}>
                Add Banner
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    required
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
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
                        {formData.image && (
                            <Typography variant="body2" sx={{ mt: 1, color: '#FF6B00' }}>
                                {formData.image.name}
                            </Typography>
                        )}
                    </label>
                </Box>

                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!formData.title || !formData.image}
                    fullWidth
                    sx={{
                        bgcolor: '#FF6B00',
                        '&:hover': { bgcolor: '#cc5500' },
                        '&.Mui-disabled': {
                            bgcolor: 'rgba(255, 107, 0, 0.3)'
                        }
                    }}
                >
                    Create Banner
                </Button>
            </Box>
        </Paper>
    );
};

export default AddBanner; 