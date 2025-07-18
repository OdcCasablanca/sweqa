import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Store as StoreIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  PhotoCamera,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axios';
import CreateStore from './CreateStore';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';

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
            <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
              <XAxis dataKey="name" hide />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

// Example data for the cards
const lineData = [
  { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }
];
const barData = [
  { name: 'M', value: 10 }, { name: 'T', value: 30 }, { name: 'W', value: 20 }, { name: 'T', value: 40 }, { name: 'F', value: 35 }, { name: 'S', value: 15 }, { name: 'S', value: 50 }
];

const Dashboard = ({ onCreateStore }) => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openCreateStore, setOpenCreateStore] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchAllProducts();
    fetchAllOrders();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/stores/my-stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError(
        error.response?.data?.message || 
        'Erreur lors du chargement des boutiques. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const storesRes = await axiosInstance.get('/stores/my-stores');
      const allProducts = [];
      for (const store of storesRes.data) {
        const res = await axiosInstance.get(`/products/store/${store._id}`);
        allProducts.push(...res.data);
      }
      setProducts(allProducts);
    } catch (error) {
      setProducts([]);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const storesRes = await axiosInstance.get('/stores/my-stores');
      const allOrders = [];
      for (const store of storesRes.data) {
        const res = await axiosInstance.get(`/orders/store/${store._id}`);
        allOrders.push(...res.data);
      }
      setOrders(allOrders);
    } catch (error) {
      setOrders([]);
    }
  };

  const handleStoreDeleted = (id) => {
    setStores(stores.filter((store) => store._id !== id));
    fetchAllProducts();
    fetchAllOrders();
  };

  const handleStoreCreated = (newStore) => {
    setStores(prev => [newStore, ...prev]);
    setOpenCreateStore(false);
    fetchAllProducts();
    fetchAllOrders();
  };

  const StoreCard = ({ store, onStoreDeleted }) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [storeData, setStoreData] = useState({
      name: store.name,
      description: store.description,
      logo: store.logo
    });
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Dynamic counts for this store
    const storeOrders = orders.filter(o => o.store === store._id || o.store?._id === store._id);
    const storeProducts = products.filter(p => p.store === store._id || p.store?._id === store._id);

    const handleEditStore = async () => {
      try {
        await axiosInstance.put(`/stores/${store._id}`, storeData);
        window.location.reload();
      } catch (error) {
        console.error('Error updating store:', error);
        setError(error.response?.data?.message || 'Error updating store');
      }
    };

    const handleDeleteStore = async () => {
      try {
        await axiosInstance.delete(`/stores/${store._id}`);
        setDeleteDialogOpen(false);
        if (onStoreDeleted) onStoreDeleted(store._id);
        fetchAllProducts();
        fetchAllOrders();
      } catch (error) {
        // Optionally show error
      }
    };

    return (
      <>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={store.logo} 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: '#FF6B00',
                  mr: 2 
                }}
              >
                <StoreIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {store.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {store.description}
                </Typography>
              </Box>
              <IconButton
                onClick={() => setEditDialogOpen(true)}
                sx={{
                  color: '#FF6B00',
                  '&:hover': {
                    bgcolor: 'rgba(255, 107, 0, 0.1)',
                  },
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  color: '#FF6B00',
                  '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    textAlign: 'center',
                    bgcolor: '#FFF3E0'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#FF6B00' }}>{storeOrders.length}</Typography>
                  <Typography variant="body2">Commandes</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    textAlign: 'center',
                    bgcolor: '#FFF3E0'
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#FF6B00' }}>{storeProducts.length}</Typography>
                  <Typography variant="body2">Produits</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              URL: {window.location.origin}/store/{store.slug}
            </Typography>
          </CardContent>

          <Divider />

          <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Box>
              <Tooltip title="Gérer la boutique">
                <IconButton 
                  component={RouterLink} 
                  to={`/store-admin/${store._id}`}
                  sx={{ color: '#FF6B00' }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Voir la boutique">
                <IconButton 
                  component={RouterLink} 
                  to={`/store/${store.slug}`}
                  target="_blank"
                  sx={{ color: '#FF6B00' }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardActions>
        </Card>

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: '#FFFFFF',
              minWidth: { xs: '90%', sm: '500px' },
              '& .MuiDialogTitle-root': {
                fontSize: '1.5rem',
                fontWeight: 'normal'
              }
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#FF6B00', 
            borderBottom: '1px solid #eee',
            pb: 2
          }}>
            Modifier la boutique
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  Nom de la boutique
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFFFF',
                      '& fieldset': { 
                        borderColor: '#e0e0e0',
                        borderWidth: '1px'
                      },
                      '&:hover fieldset': { 
                        borderColor: '#FF6B00' 
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#FF6B00',
                        borderWidth: '1px'
                      },
                      '& input': {
                        padding: '12px 14px',
                        fontSize: '1rem'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={storeData.description}
                  onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFFFF',
                      '& fieldset': { 
                        borderColor: '#e0e0e0',
                        borderWidth: '1px'
                      },
                      '&:hover fieldset': { 
                        borderColor: '#FF6B00' 
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#FF6B00',
                        borderWidth: '1px'
                      },
                      '& textarea': {
                        padding: '12px 14px',
                        fontSize: '1rem'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={storeData.logo}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: '#FF6B00'
                    }}
                  >
                    <StoreIcon />
                  </Avatar>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{
                      color: '#FF6B00',
                      borderColor: '#FF6B00',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#cc5500',
                        bgcolor: 'rgba(255,107,0,0.1)'
                      }
                    }}
                  >
                    Changer le logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setStoreData({ ...storeData, logo: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: '1px solid #eee', 
            p: 2,
            px: 3,
            gap: 1
          }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              variant="text"
              sx={{ 
                color: '#666',
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleEditStore}
              variant="contained"
              sx={{
                bgcolor: '#FF6B00',
                textTransform: 'none',
                fontSize: '1rem',
                px: 3,
                '&:hover': { 
                  bgcolor: '#cc5500' 
                }
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Store</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this store?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteStore} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF6B00' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4, pt: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
       
      </Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          bgcolor: '#FF6B00',
          color: '#FFFFFF',
          mt: '5px',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Bonjour, {user?.name || 'Entrepreneur'}
            </Typography>
            <Typography variant="body1">
              Gérez vos boutiques en ligne et suivez vos performances en temps réel.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateStore}
              sx={{
                bgcolor: '#FFFFFF',
                color: '#FF6B00',
                '&:hover': {
                  bgcolor: '#FFF3E0',
                },
              }}
            >
              CRÉER UNE BOUTIQUE
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CartIcon />} color={cardColors.blue} label="Orders" value={orders.length} chartType="line" data={lineData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<StoreIcon />} color={cardColors.green} label="Products" value={products.length} chartType="line" data={lineData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CategoryIcon />} color={cardColors.purple} label="Categories" value={stores.reduce((sum, s) => sum + (s.categoriesCount || 0), 0)} chartType="line" data={lineData} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<PeopleIcon />} color={cardColors.orange} label="Customers" value={[...new Set(orders.map(o => o.customerEmail).filter(Boolean))].length} chartType="bar" data={barData} />
        </Grid>
      </Grid>

      {/* Stores Grid */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mes Boutiques
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} sm={6} md={4} key={store._id}>
            <StoreCard store={store} onStoreDeleted={handleStoreDeleted} />
          </Grid>
        ))}
        {stores.length === 0 && !loading && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <StoreIcon sx={{ fontSize: 60, color: '#FF6B00', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Vous n'avez pas encore de boutique
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Créez votre première boutique en ligne en quelques minutes
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateStore}
                sx={{
                  bgcolor: '#FF6B00',
                  '&:hover': { bgcolor: '#FF8533' },
                }}
              >
                Créer une boutique
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      <CreateStore
        open={openCreateStore}
        onClose={() => setOpenCreateStore(false)}
        onStoreCreated={handleStoreCreated}
      />
    </Container>
  );
};

export default Dashboard; 