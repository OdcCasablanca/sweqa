import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Fade, Grid, Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StoreBanner from '../components/StoreBanner';
import axiosInstance from '../utils/axiosInstance';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_live_REPLACE_WITH_YOUR_KEY'; // TODO: Replace with your real publishable key

const CheckoutPage = () => {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const { storeSlug: paramStoreSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [open, setOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showCardForm, setShowCardForm] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // Get storeSlug from params or query string
  let storeSlug = paramStoreSlug;
  if (!storeSlug) {
    const params = new URLSearchParams(location.search);
    storeSlug = params.get('storeSlug');
  }

  useEffect(() => {
    const fetchStore = async () => {
      if (storeSlug) {
        const res = await axiosInstance.get(`/stores/slug/${storeSlug}`);
        setStore(res.data);
      }
    };
    fetchStore();
  }, [storeSlug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    setShowCardForm(e.target.value === 'card');
  };

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!store || cartItems.length === 0) {
      setError('No store or cart is empty.');
      return;
    }
    if (paymentMethod === 'card') {
      if (!card.number || !card.expiry || !card.cvc || !card.name) {
        setError('Please fill in all card details.');
        return;
      }
      try {
        const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        const response = await axiosInstance.post('/api/create-checkout-session', {
          items: cartItems,
          customerEmail: form.email,
          successUrl: window.location.origin + `/store/${storeSlug}/checkout?success=1`,
          cancelUrl: window.location.origin + `/store/${storeSlug}/checkout?canceled=1`,
        });
        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          setError('Failed to create Stripe session.');
        }
      } catch (err) {
        setError('Stripe payment failed.');
      }
      return;
    }
    try {
      await axiosInstance.post('/orders', {
        storeId: store._id,
        customerName: form.name || '',
        customerEmail: form.email,
        customerPhone: form.phone,
        customerAddress: form.address,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          color: item.selectedColor || '',
          size: item.selectedSize || ''
        })),
        total: getCartTotal(),
        paymentMethod,
      });
      setSubmitted(true);
      clearCart();
      setOpen(false); // Close checkout modal
      setSuccessOpen(true); // Open success modal
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate(-1); // Go back to previous page
    }, 200);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Checkout
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column - Order Summary */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                <List>
                  {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.image || ''}
                          alt={item.name}
                          variant="rounded"
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${getCartTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>${0.00.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax</Typography>
                  <Typography>${0.00.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>${getCartTotal().toFixed(2)}</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Customer Information */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Customer Information
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                        Payment Method
                      </Typography>
                      <label style={{ marginRight: '1.5rem' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={handlePaymentChange}
                        />
                        Cash on Delivery
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={handlePaymentChange}
                        />
                        Pay with Card
                      </label>
                    </Grid>
                    {showCardForm && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            label="Card Number"
                            name="number"
                            value={card.number}
                            onChange={handleCardChange}
                            variant="outlined"
                            inputProps={{ maxLength: 19 }}
                            placeholder="1234 5678 9012 3456"
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            required
                            fullWidth
                            label="Expiry"
                            name="expiry"
                            value={card.expiry}
                            onChange={handleCardChange}
                            variant="outlined"
                            placeholder="MM/YY"
                            inputProps={{ maxLength: 5 }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            required
                            fullWidth
                            label="CVC"
                            name="cvc"
                            value={card.cvc}
                            onChange={handleCardChange}
                            variant="outlined"
                            placeholder="123"
                            inputProps={{ maxLength: 4 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            label="Cardholder Name"
                            name="name"
                            value={card.name}
                            onChange={handleCardChange}
                            variant="outlined"
                            placeholder="Name on Card"
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                          mt: 2,
                          py: 1.5,
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        Place Order
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Success Modal */}
      <Dialog
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate(-1); // Go back or redirect as needed
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Order Placed!</DialogTitle>
        <DialogContent>
          <Typography>Your order was placed successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccessOpen(false);
              navigate(-1); // Go back or redirect as needed
            }}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CheckoutPage; 