import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, Routes, Route, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip,
  GlobalStyles,
} from '@mui/material';
import {
  Add as AddIcon,
  Store as StoreIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Category as CategoryIcon,
  LocalOffer as TagIcon,
  Settings as SettingsIcon,
  Pages as PagesIcon,
  ViewCarousel as BannerIcon,
  Search,
  PhotoCamera,
  TrendingUp,
  People,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axiosInstance from '../utils/axios';
import CreateProduct from '../components/CreateProduct';
import EditProduct from '../components/EditProduct';
import CategoryManagement from '../components/CategoryManagement';
import StoreSidebar from '../components/StoreSidebar';
import { useAuth } from '../contexts/AuthContext';
import PageManagement from '../components/PageManagement';
import BannerManagement from '../components/BannerManagement';
import ProductGrid from '../components/ProductGrid';
import OrdersList from './OrdersList';

const DRAWER_WIDTH = 280;

// Add mock data for demonstration (replace with real data later)
const orderData = [
  { name: 'Jan', orders: 4, revenue: 400 },
  { name: 'Feb', orders: 7, revenue: 700 },
  { name: 'Mar', orders: 12, revenue: 1200 },
  { name: 'Apr', orders: 15, revenue: 1500 },
  { name: 'May', orders: 18, revenue: 1800 },
  { name: 'Jun', orders: 22, revenue: 2200 },
];

const customerData = [
  { name: 'New', value: 30 },
  { name: 'Returning', value: 70 },
];

const COLORS = ['#FF6B00', '#FFB27D'];

// Example data for products by category
const productsByCategory = [
  { name: 'Electronics', value: 12 },
  { name: 'Clothing', value: 8 },
  { name: 'Books', value: 5 },
  { name: 'Other', value: 3 },
];

// Add StatCard and cardColors from Dashboard.js
const cardColors = {
  blue: '#4FC3F7',
  green: '#66BB6A',
  orange: '#FF9800',
  purple: '#AB47BC',
};

function StatCard({ icon, color, label, value, chartType, data }) {
  return (
    <Paper sx={{ borderRadius: 3, p: 2, boxShadow: 2, minWidth: 220 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>{icon}</Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
          <Typography variant="h5" fontWeight={700} color={color}>{value}</Typography>
        </Box>
      </Box>
      <Box mt={2} height={60}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={orderData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="orders" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={productsByCategory} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
              <XAxis dataKey="name" hide />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

// Component definitions
const ComingSoon = ({ title }) => (
  <Box sx={{ p: 3 }}>
    <Paper sx={{ p: 4, backgroundColor: '#000000', color: '#FFFFFF' }}>
      <Typography variant="h5" sx={{ color: '#FF6B00', mb: 2 }}>{title}</Typography>
      <Typography>This feature is coming soon!</Typography>
    </Paper>
  </Box>
);

const DashboardComponent = ({ store, products, storeId }) => {
  return (
    <Grid container spacing={3} sx={{ ml: 0 }}> {/* Ensure no left margin on parent Grid */}
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={2} sx={{ ml: 0 }}> {/* Ensure no left margin on cards row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CartIcon />} color={cardColors.blue} label="Orders" value={orderData.reduce((sum, d) => sum + d.orders, 0)} chartType="line" data={orderData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<StoreIcon />} color={cardColors.green} label="Products" value={products.length} chartType="line" data={orderData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CategoryIcon />} color={cardColors.purple} label="Categories" value={new Set(products.map(p => p.category?._id).filter(Boolean)).size} chartType="line" data={orderData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<People />} color={cardColors.orange} label="Customers" value={[...new Set((store?.orders || []).map(o => o.customerEmail).filter(Boolean))].length} chartType="bar" data={productsByCategory} />
        </Grid>
      </Grid>

      {/* New Store Overview with Graphs */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, bgcolor: '#fff', color: '#1a1a1a', borderRadius: 3, boxShadow: 2, ml: 0 }}> {/* Ensure no left margin on overview */}
          <Typography variant="h6" sx={{ color: '#FF6B00', mb: 3 }}>Store Overview</Typography>
          <Grid container spacing={3}>
            {/* Orders and Revenue Chart */}
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#1a1a1a' }}>Orders & Revenue</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={orderData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="orders"
                      stroke="#FF6B00"
                      activeDot={{ r: 8 }}
                      name="Orders"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FFB27D"
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            {/* Customer Distribution Pie Chart */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: '#1a1a1a' }}>Customer Distribution</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const ProductsListComponent = ({ products, setProducts, storeId, store }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`/categories/store/${storeId}`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (productId) => {
    navigate(`/store-admin/${storeId}/edit-product/${productId}`);
  };

  const handleView = (productId) => {
    window.open(`/store/${store?.slug}/products/${productId}`, '_blank');
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await axiosInstance.delete(`/products/${productToDelete}`);
      setProducts(products.filter(p => p._id !== productToDelete));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'transparent' }}>
      <Box sx={{ mb: 4 }}>
        {/* Dashboard Link */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to={`/store-admin/${storeId}`}
            startIcon={<CartIcon />}
            sx={{
              color: '#666',
              textTransform: 'none',
              '&:hover': {
                color: '#FF6B00',
                bgcolor: 'transparent'
              }
            }}
          >
            Dashboard
          </Button>
          <Typography sx={{ color: '#666', mx: 1 }}>/</Typography>
          <Typography sx={{ color: '#1a1a1a', fontWeight: 500 }}>Products</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to={`/store-admin/${storeId}/create-product`}
            sx={{
              bgcolor: '#FF6B00',
              '&:hover': { bgcolor: '#ff8533' },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
            }}
          >
            ADD PRODUCT
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#FF6B00' },
                  '&.Mui-focused fieldset': { borderColor: '#FF6B00' },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
                sx={{
                  bgcolor: 'transparent',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF6B00',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF6B00',
                  },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={1}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'transparent',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                height: 390,
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Box sx={{ position: 'relative', height: 220, bgcolor: '#f5f5f5' }}>
                <img
                  src={product.images?.[0]?.url || '/placeholder-product.png'}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: '#FF6B00',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  ${product.price.toFixed(2)}
                </Box>
              </Box>
              
              <Box sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#1a1a1a', fontSize: '1.1rem' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  {product.description?.substring(0, 100)}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 2, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={product.category?.name || 'Uncategorized'}
                      size="small"
                      sx={{
                        bgcolor: '#FF6B00',
                        color: '#fff',
                        borderRadius: '16px',
                      }}
                    />
                    <Chip
                      label={`${product.stock} in stock`}
                      size="small"
                      sx={{
                        bgcolor: product.stock > 0 ? '#4caf50' : '#f44336',
                        color: '#fff',
                        borderRadius: '16px',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => handleEdit(product._id)}
                      size="small"
                      sx={{
                        color: '#FF6B00',
                        '&:hover': { bgcolor: 'rgba(255,107,0,0.1)' },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleView(product._id)}
                      size="small"
                      sx={{
                        color: '#FF6B00',
                        '&:hover': { bgcolor: 'rgba(255,107,0,0.1)' },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(product._id)}
                      size="small"
                      sx={{
                        color: '#FF6B00',
                        '&:hover': { bgcolor: 'rgba(255,107,0,0.1)' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#1a1a1a' }}>Delete Product</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#666' }}>
            Are you sure you want to delete this product?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              color: '#666',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              bgcolor: '#FF6B00',
              '&:hover': { bgcolor: '#ff8533' },
              textTransform: 'none',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const StoreAdmin = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreData();
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      const [storeRes, productsRes] = await Promise.all([
        axiosInstance.get(`/stores/id/${storeId}`),
        axiosInstance.get(`/products/store/${storeId}`)
      ]);
      setStore(storeRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
      if (error.response?.status === 401) {
        console.log('Unauthorized access - please log in');
      }
    } finally {
      setLoading(false);
    }
  };

  const Sidebar = () => (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: 'calc(100vh - 64px)',
        bgcolor: '#FFFFFF',
        position: 'fixed',
        left: 0,
        top: 64,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1100,
        border: '2px solid #e0e0e0',
        borderBottom: '2.5px solid #e0e0e0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}
    >
      {/* Store Info Section */}
      <Box
        sx={{
          width: '100%',
          bgcolor: '#FFFFFF',
          p: 3,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={store?.logo}
            sx={{
              width: 50,
              height: 50,
              bgcolor: '#FF6B00',
              mr: 2,
            }}
          >
            <StoreIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: '#1a1a1a', whiteSpace: 'nowrap' }}>
              {store?.name || 'Loading...'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {store?.description}
            </Typography>
          </Box>
        </Box>

        <Button
          component={RouterLink}
          to={`/store/${store?.slug}`}
          target="_blank"
          variant="outlined"
          fullWidth
          startIcon={<VisibilityIcon />}
          sx={{
            color: '#FF6B00',
            borderColor: '#FF6B00',
            '&:hover': {
              borderColor: '#FF8533',
              bgcolor: 'rgba(255, 107, 0, 0.1)',
            },
          }}
        >
          Voir la boutique
        </Button>
      </Box>

      {/* Navigation Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: '#f5f5f5' },
          '&::-webkit-scrollbar-thumb': {
            background: '#ddd',
            borderRadius: '3px',
            '&:hover': { background: '#ccc' },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Add My Stores button at the top */}
          <Button
            component={RouterLink}
            to="/dashboard"
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              color: '#FF6B00',
              py: 1.5,
              px: 2,
              mb: 2,
              border: '1px solid #FF6B00',
              '&:hover': {
                bgcolor: 'rgba(255, 107, 0, 0.1)',
                borderColor: '#FF8533',
              },
            }}
          >
            ← Retour à mes boutiques
          </Button>

          <Typography variant="overline" sx={{ color: '#666666', px: 2, display: 'block' }}>
            GESTION
          </Typography>
          <Box sx={{ mt: 1 }}>
            {[
              { icon: <CartIcon />, label: 'Dashboard', path: '' },
              { icon: <CartIcon />, label: 'ORDERS', path: '/orders' },
              { icon: <CartIcon />, label: 'Produits', path: '/products' },
              { icon: <CategoryIcon />, label: 'Catégories', path: '/categories' },
              { icon: <SettingsIcon />, label: 'Paramètres', path: '/settings' },
            ].map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={`/store-admin/${storeId}${item.path}`}
                startIcon={item.icon}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  color: '#666666',
                  py: 1.5,
                  px: 2,
                  border: '1px solid #f0f0f0',
                  borderRadius: '10px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  mb: 1.2,
                  background: '#fff',
                  transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#FFF3E0',
                    color: '#FF6B00',
                    boxShadow: '0 4px 16px rgba(255,107,0,0.10)',
                    borderColor: '#FFB27D',
                    transform: 'translateY(-2px) scale(1.03)',
                  },
                  '&.Mui-selected, &.active': {
                    bgcolor: '#FF6B00',
                    color: '#fff',
                    borderColor: '#FF6B00',
                    boxShadow: '0 2px 8px rgba(255,107,0,0.15)',
                    transform: 'scale(1.04)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  if (!store) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { sm: `${DRAWER_WIDTH}px` },
            mt: '64px',
            bgcolor: '#000000',
            color: '#FFFFFF'
          }}
        >
          <Alert severity="info">Loading...</Alert>
        </Box>
      </Box>
    );
  }

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
            transition: 'background 0.3s',
            '&:hover': {
              background: 'rgba(255, 107, 0, 0.5)',
            },
          },
          '*': {
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 107, 0, 0.3) transparent',
          },
        }}
      />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${DRAWER_WIDTH}px`,
            mt: '46px',
            p: 3,
            position: 'relative',
            bgcolor: 'transparent',
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 0, p: 0, pt: 3, bgcolor: 'transparent' }}>
            <Routes>
              <Route path="/" element={<DashboardComponent store={store} products={products} storeId={storeId} />} />
              <Route path="/products" element={<ProductsListComponent products={products} setProducts={setProducts} storeId={storeId} store={store} />} />
              <Route path="/create-product" element={<CreateProduct onProductCreated={(newProduct) => setProducts(prev => [...prev, newProduct])} />} />
              <Route path="/edit-product/:productId" element={<EditProduct />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/pages" element={<PageManagement />} />
              <Route path="/banners" element={<BannerManagement />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/settings" element={<ComingSoon title="Store Settings" />} />
              <Route path="/theme" element={<ComingSoon title="Store Theme" />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default StoreAdmin; 