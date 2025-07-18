import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  Tooltip,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Store as StoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';

const VisuallyHiddenInput = (props) => (
  <input
    style={{
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    }}
    {...props}
  />
);

const CreateStore = ({ open = true, onClose, onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
    
      let logoUrl = '';
      if (logo) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', logo);
        const response = await axiosInstance.post(
          '/upload',
          formDataUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        logoUrl = response.data.url;
      }
      const res = await axiosInstance.post(
        '/stores',
        {
          ...formData,
          logo: logoUrl,
        }
      );
      if (onStoreCreated) onStoreCreated(res.data);
      if (onClose) onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.name && formData.description;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          boxShadow: 8,
          bgcolor: '#fff',
          color: '#222',
          p: 0,
        },
      }}
      BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.25)' } }}
    >
      <DialogTitle sx={{
        fontWeight: 700,
        fontSize: 28,
        color: '#222',
        pb: 0,
        pr: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        Create Your Store
        <IconButton onClick={onClose} sx={{ color: '#888' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2, pb: 0 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Tooltip title="Upload Store Logo" arrow>
                <IconButton component="label" sx={{ p: 0 }}>
                  <Avatar
                    src={logoPreview}
                    sx={{
                      width: 100,
                      height: 100,
                      border: `3px solid #eee`,
                      position: 'relative',
                      boxShadow: 2,
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    {!logoPreview && <StoreIcon sx={{ fontSize: 40, color: '#fff' }} />}
                    <Box
                      className="upload-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        borderRadius: '50%',
                        '&:hover': {
                          opacity: 1,
                        }
                      }}
                    >
                      <UploadIcon sx={{ color: '#fff' }} />
                    </Box>
                  </Avatar>
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" sx={{ display: 'block', color: '#888' }}>
                Upload Store Logo (Max 5MB)
              </Typography>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Store Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                helperText="This will be used to create your store's URL"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fafafa',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="description"
                label="Store Description"
                id="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                helperText="Tell customers about your store"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fafafa',
                  },
                }}
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ px: 0, pt: 3, pb: 1 }}>
            <Button
              onClick={onClose}
              sx={{ color: '#222', borderColor: '#eee' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || loading}
              sx={{
                bgcolor: '#FF6B00',
                color: '#fff',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: '#cc5500',
                },
                '&.Mui-disabled': {
                  bgcolor: '#eee',
                  color: '#aaa',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Store'
              )}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStore; 