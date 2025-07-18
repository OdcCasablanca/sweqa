import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Tooltip,
    Alert,
    Paper,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Slide,
    DialogContentText,
    GlobalStyles,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ShoppingBag as ProductIcon,
    Search as SearchIcon,
    CategoryOutlined as CategoryIcon,
    ShoppingBasket,
    Devices,
    SportsEsports,
    Checkroom,
    Restaurant,
    LocalShipping,
    Pets,
    ChildCare,
    FitnessCenter,
    Book,
    Home,
    LocalOffer,
    Warning as WarningIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axios';

// Available icons for categories
const AVAILABLE_ICONS = [
    { 
        name: 'CategoryIcon',
        component: CategoryIcon,
        label: 'Default Category',
        suggestedName: 'General Category',
        suggestedDescription: 'A general category for miscellaneous items'
    },
    { 
        name: 'ShoppingBasket',
        component: ShoppingBasket,
        label: 'Shopping Basket',
        suggestedName: 'Groceries',
        suggestedDescription: 'Fresh groceries and daily essentials'
    },
    { 
        name: 'Devices',
        component: Devices,
        label: 'Electronics',
        suggestedName: 'Electronics',
        suggestedDescription: 'Electronic devices and accessories'
    },
    { 
        name: 'SportsEsports',
        component: SportsEsports,
        label: 'Gaming',
        suggestedName: 'Gaming',
        suggestedDescription: 'Video games and gaming accessories'
    },
    { 
        name: 'Checkroom',
        component: Checkroom,
        label: 'Fashion',
        suggestedName: 'Fashion',
        suggestedDescription: 'Clothing, accessories, and fashion items'
    },
    { 
        name: 'Restaurant',
        component: Restaurant,
        label: 'Food',
        suggestedName: 'Food & Beverages',
        suggestedDescription: 'Food, drinks, and culinary items'
    },
    { 
        name: 'LocalShipping',
        component: LocalShipping,
        label: 'Shipping',
        suggestedName: 'Shipping',
        suggestedDescription: 'Shipping and delivery services'
    },
    { 
        name: 'Pets',
        component: Pets,
        label: 'Pets',
        suggestedName: 'Pet Supplies',
        suggestedDescription: 'Pet food, accessories, and care items'
    },
    { 
        name: 'ChildCare',
        component: ChildCare,
        label: 'Kids',
        suggestedName: 'Kids & Baby',
        suggestedDescription: 'Children\'s clothing, toys, and accessories'
    },
    { 
        name: 'FitnessCenter',
        component: FitnessCenter,
        label: 'Fitness',
        suggestedName: 'Fitness & Sports',
        suggestedDescription: 'Sports equipment and fitness accessories'
    },
    { 
        name: 'Book',
        component: Book,
        label: 'Books',
        suggestedName: 'Books & Media',
        suggestedDescription: 'Books, magazines, and digital media'
    },
    { 
        name: 'Home',
        component: Home,
        label: 'Home',
        suggestedName: 'Home & Living',
        suggestedDescription: 'Home decor and household items'
    },
    { 
        name: 'LocalOffer',
        component: LocalOffer,
        label: 'Offers',
        suggestedName: 'Special Offers',
        suggestedDescription: 'Discounted items and special deals'
    },
];

// Available colors for icons
const ICON_COLORS = [
    { name: 'Orange', value: '#FF6B00' },
    { name: 'Blue', value: '#2196F3' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Red', value: '#F44336' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Teal', value: '#009688' },
    { name: 'Pink', value: '#E91E63' },
    { name: 'Brown', value: '#795548' },
];

const CategoryManagement = () => {
    const { storeId } = useParams();
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        description: '', 
        icon: 'CategoryIcon',
        iconColor: '#FF6B00'
    });
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [storeId]);

    const fetchCategories = async () => {
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                axiosInstance.get(`/categories/store/${storeId}`),
                axiosInstance.get(`/products/store/${storeId}`)
            ]);
            
            const products = productsRes.data;
            const productCountByCategory = products.reduce((acc, product) => {
                const categoryId = product.category?._id;
                if (categoryId) {
                    acc[categoryId] = (acc[categoryId] || 0) + 1;
                }
                return acc;
            }, {});

            setCategoryProducts(productCountByCategory);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load categories and products');
        }
    };

    const handleOpenDialog = (category = null) => {
        setEditingCategory(category);
        setFormData(category || { 
            name: '', 
            description: '', 
            icon: 'CategoryIcon',
            iconColor: '#FF6B00'
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCategory(null);
        setFormData({ 
            name: '', 
            description: '', 
            icon: 'CategoryIcon',
            iconColor: '#FF6B00'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axiosInstance.put(`/categories/${editingCategory._id}`, formData);
            } else {
                await axiosInstance.post('/categories', { ...formData, store: storeId });
            }
            fetchCategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Failed to save category');
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            await axiosInstance.delete(`/categories/${categoryToDelete._id}`);
            fetchCategories();
            setDeleteConfirmOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category');
        }
    };

    const handleIconChange = (e) => {
        const selectedIcon = AVAILABLE_ICONS.find(icon => icon.name === e.target.value);
        setFormData(prev => ({
            ...prev,
            icon: e.target.value,
            name: editingCategory ? prev.name : selectedIcon.suggestedName,
            description: editingCategory ? prev.description : selectedIcon.suggestedDescription
        }));
    };

    // Filter and sort categories
    const filteredCategories = categories
        .filter(category => 
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'products':
                    return (categoryProducts[b._id] || 0) - (categoryProducts[a._id] || 0);
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

    // Get the icon component by name
    const getIconComponent = (iconName) => {
        const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
        return icon ? icon.component : CategoryIcon;
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    '*::-webkit-scrollbar': {
                        width: '8px',
                        background: 'transparent',
                    },
                    '*::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 107, 0, 0.3)',
                        borderRadius: '4px',
                        '&:hover': {
                            background: 'rgba(255, 107, 0, 0.5)',
                        },
                    },
                    '*': {
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255, 107, 0, 0.3) transparent',
                    },
                    '.MuiDialog-paper': {
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255, 107, 0, 0.3) transparent',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 107, 0, 0.3)',
                            borderRadius: '3px',
                            '&:hover': {
                                background: 'rgba(255, 107, 0, 0.5)',
                            },
                        },
                    },
                }}
            />
            <Box 
                sx={{ 
                    p: 3, 
                    minHeight: 'auto',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                {/* Header Section */}
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
                        Categories
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            bgcolor: '#FF6B00',
                            '&:hover': { bgcolor: '#ff8533' },
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                        }}
                    >
                        Add Category
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Search and Filter Section */}
                <Paper 
                    sx={{ 
                        p: 2, 
                        mb: 3,
                        position: 'sticky',
                        top: 80,
                        zIndex: 1,
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                    elevation={0}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#666' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': { borderColor: '#FF6B00' },
                                        '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Sort By"
                                >
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="products">Number of Products</MenuItem>
                                    <MenuItem value="newest">Newest First</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Categories Grid */}
                <Grid container spacing={3}>
                    {filteredCategories.map((category, index) => {
                        const IconComponent = getIconComponent(category.icon);
                        return (
                            <Grid 
                                item 
                                xs={12} 
                                sm={6} 
                                md={4} 
                                key={category._id}
                                sx={{
                                    opacity: 0,
                                    animation: 'fadeIn 0.5s ease forwards',
                                    animationDelay: `${index * 0.1}s`,
                                    '@keyframes fadeIn': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(20px)',
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0)',
                                        },
                                    },
                                }}
                            >
                                <Card 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: '#FFFFFF',
                                        borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <IconComponent sx={{ color: category.iconColor, mr: 1, fontSize: 32 }} />
                                            <Typography variant="h6" sx={{ color: '#1a1a1a' }}>
                                                {category.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {category.description || 'No description available'}
                                        </Typography>
                                        <Chip 
                                            label={`${categoryProducts[category._id] || 0} products`}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255, 107, 0, 0.1)',
                                                color: '#FF6B00',
                                                fontWeight: 500,
                                            }}
                                        />
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end', p: 1.5 }}>
                                        <Tooltip title="Edit">
                                            <IconButton 
                                                onClick={() => handleOpenDialog(category)}
                                                sx={{ 
                                                    color: '#FF6B00',
                                                    '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' }
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton 
                                                onClick={() => handleDeleteClick(category)}
                                                sx={{ 
                                                    color: '#FF6B00',
                                                    '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Add/Edit Category Dialog */}
                <Dialog 
                    open={openDialog} 
                    onClose={handleCloseDialog}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            maxWidth: '400px',
                            width: '100%'
                        }
                    }}
                >
                    <DialogTitle sx={{ color: '#1a1a1a' }}>
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent sx={{ minWidth: 400 }}>
                            {/* Icon Selection - Moved to top */}
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Choose Category Icon</InputLabel>
                                <Select
                                    value={formData.icon}
                                    onChange={handleIconChange}
                                    label="Choose Category Icon"
                                >
                                    {AVAILABLE_ICONS.map((icon) => {
                                        const IconComponent = icon.component;
                                        return (
                                            <MenuItem key={icon.name} value={icon.name}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    py: 1
                                                }}>
                                                    <IconComponent sx={{ 
                                                        mr: 2, 
                                                        color: formData.iconColor,
                                                        fontSize: 28
                                                    }} />
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {icon.suggestedName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {icon.suggestedDescription}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            {/* Icon Color Selection */}
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Icon Color</InputLabel>
                                <Select
                                    value={formData.iconColor}
                                    onChange={(e) => setFormData({ ...formData, iconColor: e.target.value })}
                                    label="Icon Color"
                                >
                                    {ICON_COLORS.map((color) => (
                                        <MenuItem key={color.value} value={color.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        bgcolor: color.value,
                                                        mr: 1,
                                                        border: '2px solid #eee'
                                                    }}
                                                />
                                                {color.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Preview */}
                            <Paper 
                                sx={{ 
                                    p: 2, 
                                    mb: 3,
                                    display: 'flex', 
                                    alignItems: 'center',
                                    bgcolor: 'rgba(255, 107, 0, 0.1)',
                                    justifyContent: 'center'
                                }}
                            >
                                {React.createElement(getIconComponent(formData.icon), {
                                    sx: { color: formData.iconColor, fontSize: 40, mr: 2 }
                                })}
                                <Typography variant="subtitle1" fontWeight="500">
                                    {formData.name || 'Category Preview'}
                                </Typography>
                            </Paper>

                            <TextField
                                margin="dense"
                                label="Category Name"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B00',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#FF6B00',
                                    },
                                }}
                            />
                            
                            <TextField
                                margin="dense"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FF6B00',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#FF6B00',
                                    },
                                }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 2, pt: 0 }}>
                            <Button 
                                onClick={handleCloseDialog}
                                sx={{ 
                                    color: '#666666',
                                    '&:hover': { bgcolor: '#f5f5f5' }
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
                                    textTransform: 'none',
                                }}
                            >
                                {editingCategory ? 'Save Changes' : 'Add Category'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* Add Delete Confirmation Dialog */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={handleDeleteCancel}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            maxWidth: '400px',
                            width: '100%'
                        }
                    }}
                    TransitionComponent={Slide}
                    TransitionProps={{ direction: "up" }}
                >
                    <DialogTitle sx={{ 
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#d32f2f'
                    }}>
                        <WarningIcon sx={{ color: '#d32f2f' }} />
                        Delete Category
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mb: 3, mt: 1 }}>
                            {categoryToDelete && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    bgcolor: 'rgba(255, 107, 0, 0.1)',
                                    p: 2,
                                    borderRadius: 1,
                                    mb: 2
                                }}>
                                    {React.createElement(getIconComponent(categoryToDelete.icon), {
                                        sx: { color: categoryToDelete.iconColor, fontSize: 32, mr: 2 }
                                    })}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="500">
                                            {categoryToDelete.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {categoryProducts[categoryToDelete._id] || 0} products
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            <DialogContentText color="text.secondary">
                                Are you sure you want to delete this category? This action cannot be undone.
                                {categoryProducts[categoryToDelete?._id] > 0 && (
                                    <Typography 
                                        component="div" 
                                        sx={{ 
                                            mt: 2,
                                            color: '#d32f2f',
                                            bgcolor: 'rgba(211, 47, 47, 0.1)',
                                            p: 1.5,
                                            borderRadius: 1,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Warning: This category contains {categoryProducts[categoryToDelete?._id]} products. 
                                        Deleting it will remove the category association from these products.
                                    </Typography>
                                )}
                            </DialogContentText>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 0 }}>
                        <Button
                            onClick={handleDeleteCancel}
                            sx={{
                                color: 'text.secondary',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            variant="contained"
                            sx={{
                                bgcolor: '#d32f2f',
                                '&:hover': { bgcolor: '#b71c1c' },
                                color: 'white',
                                textTransform: 'none'
                            }}
                            autoFocus
                        >
                            Delete Category
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default CategoryManagement; 