import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Alert,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DragHandle as DragHandleIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../utils/axios';
import { useParams } from 'react-router-dom';

const PageManagement = () => {
    const { storeId } = useParams();
    const [pages, setPages] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        showInNavigation: true
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axiosInstance.get(`/pages/store/${storeId}`);
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
            setError('Error fetching pages');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'showInNavigation' ? checked : value
        }));
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
    };

    const handleOpenDialog = (page = null) => {
        if (page) {
            setFormData({
                title: page.title,
                content: page.content,
                showInNavigation: page.showInNavigation
            });
            setEditingPage(page);
        } else {
            setFormData({
                title: '',
                content: '',
                showInNavigation: true
            });
            setEditingPage(null);
        }
        setOpenDialog(true);
        setError('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            title: '',
            content: '',
            showInNavigation: true
        });
        setEditingPage(null);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            if (editingPage) {
                await axiosInstance.put(`/pages/${editingPage._id}`, {
                    ...formData
                });
            } else {
                await axiosInstance.post('/pages', {
                    ...formData,
                    storeId
                });
            }
            handleCloseDialog();
            fetchPages();
        } catch (error) {
            console.error('Error saving page:', error);
            setError(error.response?.data?.message || 'Error saving page');
        }
    };

    const handleDelete = async (pageId) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            try {
                await axiosInstance.delete(`/pages/${pageId}`);
                fetchPages();
            } catch (error) {
                console.error('Error deleting page:', error);
                setError(error.response?.data?.message || 'Error deleting page');
            }
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(pages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setPages(items);

        // Update order in database
        try {
            await Promise.all(items.map((page, index) => 
                axiosInstance.put(`/pages/${page._id}`, {
                    ...page,
                    order: index
                })
            ));
        } catch (error) {
            console.error('Error updating page order:', error);
            setError('Error updating page order');
            fetchPages(); // Revert to original order
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ color: '#FF6B00' }}>
                    Pages
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
                    Add Page
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ 
                bgcolor: '#000000', 
                color: '#FFFFFF',
                border: '1px solid #333',
                borderRadius: 1
            }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="pages">
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef}>
                                {pages.map((page, index) => (
                                    <Draggable key={page._id} draggableId={page._id} index={index}>
                                        {(provided) => (
                                            <ListItem 
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                divider 
                                                sx={{
                                                    borderBottom: '1px solid #333',
                                                    '&:last-child': {
                                                        borderBottom: 'none'
                                                    }
                                                }}
                                            >
                                                <Box {...provided.dragHandleProps} sx={{ mr: 2, color: '#666' }}>
                                                    <DragHandleIcon />
                                                </Box>
                                                <ListItemText
                                                    primary={page.title}
                                                    secondary={
                                                        <Typography variant="body2" sx={{ color: '#999' }}>
                                                            {page.showInNavigation ? 'Shown in navigation' : 'Hidden from navigation'}
                                                        </Typography>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleOpenDialog(page)}
                                                        sx={{ color: '#FF6B00', mr: 1 }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleDelete(page._id)}
                                                        sx={{ color: '#FF6B00' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                {pages.length === 0 && (
                                    <ListItem>
                                        <ListItemText
                                            primary="No pages yet"
                                            sx={{ 
                                                textAlign: 'center', 
                                                color: '#999',
                                                py: 3
                                            }}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#000000',
                        color: '#FFFFFF',
                        border: '1px solid #333'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#FF6B00' }}>
                    {editingPage ? 'Edit Page' : 'Add Page'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Page Title"
                        type="text"
                        fullWidth
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#666',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FF6B00',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF6B00',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#999',
                                '&.Mui-focused': {
                                    color: '#FF6B00',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: '#FFFFFF',
                            },
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.showInNavigation}
                                onChange={handleInputChange}
                                name="showInNavigation"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#FF6B00',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                                        },
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#FF6B00',
                                    },
                                }}
                            />
                        }
                        label="Show in Navigation"
                        sx={{ mb: 2, color: '#999' }}
                    />

                    <Box sx={{ mb: 2, '& .ql-editor': { minHeight: '200px' } }}>
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={handleContentChange}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    ['link', 'image'],
                                    ['clean']
                                ],
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ color: '#999' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: '#FF6B00',
                            '&:hover': { bgcolor: '#cc5500' }
                        }}
                    >
                        {editingPage ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PageManagement; 