import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axiosInstance from '../utils/axios';

const statusColors = {
  cancelled: 'error',
  processing: 'default',
  pending: 'info',
  delivered: 'success',
  shipped: 'primary',
};
const paymentColors = {
  refunded: 'error',
  paid: 'success',
  pending: 'default',
};

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'refunded'];

const OrdersList = () => {
  const { storeId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders/store/${storeId}`);
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const markAsDelivered = async (orderId) => {
    await axiosInstance.put(`/orders/${orderId}/status`, { status: 'delivered' });
    fetchOrders();
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (status) => {
    if (!selectedOrder) return;
    setUpdating(true);
    await axiosInstance.put(`/orders/${selectedOrder._id}/status`, { status });
    await fetchOrders();
    setSelectedOrder({ ...selectedOrder, status });
    setUpdating(false);
  };

  const updatePaymentStatus = async (payment) => {
    if (!selectedOrder) return;
    setUpdating(true);
    await axiosInstance.put(`/orders/${selectedOrder._id}/payment`, { payment });
    await fetchOrders();
    setSelectedOrder({ ...selectedOrder, payment });
    setUpdating(false);
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ pt: 0, px: 0, pb: 3 }}>
      <TableContainer component={Paper} sx={{
        borderRadius: 4,
        boxShadow: '0 4px 24px rgba(40,33,27,0.07)',
        mt: 0,
        overflow: 'hidden',
      }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ background: '#FFF8F2', position: 'sticky', top: 0, zIndex: 1 }}>
              <TableCell sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Payment</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#FF6B00', letterSpacing: 0.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No orders found.</TableCell>
              </TableRow>
            ) : (
              orders.map((order, idx) => (
                <TableRow
                  key={order._id}
                  hover
                  sx={{
                    background: idx % 2 === 0 ? '#fff' : '#FFF6ED',
                    transition: 'background 0.2s',
                    '&:hover': {
                      background: '#FFF3E0',
                    },
                  }}
                >
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 14 }}>{order._id}</TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{order.customerName || order.customerEmail}</div>
                    <div style={{ fontSize: 13, color: '#888' }}>{order.customerEmail}</div>
                  </TableCell>
                  <TableCell sx={{ fontSize: 15 }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: '2-digit',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    }) : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip label={order.status} color={statusColors[order.status] || 'default'} size="small" sx={{ textTransform: 'capitalize', fontWeight: 600, px: 1.5, fontSize: 14, borderRadius: 2 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={order.payment || 'pending'} color={paymentColors[order.payment] || 'default'} size="small" sx={{ textTransform: 'capitalize', fontWeight: 600, px: 1.5, fontSize: 14, borderRadius: 2 }} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: 15 }}>${order.total?.toFixed(2) || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRowClick(order)}
                      sx={{
                        borderColor: '#FF6B00',
                        color: '#FF6B00',
                        borderRadius: 2,
                        px: 2.5,
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        background: '#fff',
                        boxShadow: '0 1px 4px rgba(255,107,0,0.04)',
                        transition: 'all 0.18s',
                        '&:hover': {
                          background: '#FF6B00',
                          color: '#fff',
                          borderColor: '#FF6B00',
                          boxShadow: '0 2px 8px rgba(255,107,0,0.10)',
                          transform: 'scale(1.04)',
                        },
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Order Details Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(40,33,27,0.15)',
            bgcolor: '#fff',
            p: 0,
            overflow: 'hidden',
          }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{
              bgcolor: '#FFF8F2',
              color: '#FF6B00',
              fontWeight: 700,
              fontSize: 22,
              px: 4, pt: 3, pb: 2,
              borderBottom: '1.5px solid #FFE0B2',
            }}>
              Order Details: <span style={{ fontFamily: 'monospace', color: '#FF6B00' }}>{selectedOrder._id}</span>
              <Typography variant="body2" sx={{ color: '#888', fontWeight: 400, mt: 0.5 }}>
                Order placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 4, pt: 3, pb: 2, bgcolor: '#fff' }}>
              <Box mb={2}>
                <Typography variant="subtitle2">Customer</Typography>
                <Typography>{selectedOrder.customerName || selectedOrder.customerEmail}</Typography>
                <Typography variant="body2" color="textSecondary">{selectedOrder.customerEmail}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Status</Typography>
                <Box display="flex" gap={2}>
                  <Chip label={selectedOrder.status} color={statusColors[selectedOrder.status] || 'default'} sx={{ textTransform: 'capitalize', fontWeight: 600, px: 1.5, fontSize: 15, borderRadius: 2, boxShadow: '0 1px 4px rgba(255,107,0,0.04)' }} />
                  <Chip label={selectedOrder.payment || 'pending'} color={paymentColors[selectedOrder.payment] || 'default'} sx={{ textTransform: 'capitalize', fontWeight: 600, px: 1.5, fontSize: 15, borderRadius: 2, boxShadow: '0 1px 4px rgba(255,107,0,0.04)' }} />
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Items</Typography>
                <Table size="small" sx={{ borderRadius: 2, overflow: 'hidden', mt: 1 }}>
                  <TableHead>
                    <TableRow sx={{ background: '#FFF8F2' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#FF6B00' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#FF6B00' }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#FF6B00' }}>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, idx) => (
                      <TableRow key={item.productId} sx={{ background: idx % 2 === 0 ? '#fff' : '#FFF6ED' }}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2}><b>Total</b></TableCell>
                      <TableCell><b>${selectedOrder.total?.toFixed(2)}</b></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Update Order Status</Typography>
                  {orderStatuses.map(status => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? 'contained' : 'outlined'}
                      fullWidth
                      sx={{
                        mb: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        bgcolor: selectedOrder.status === status ? '#FF6B00' : '#fff',
                        color: selectedOrder.status === status ? '#fff' : '#FF6B00',
                        borderColor: '#FF6B00',
                        boxShadow: selectedOrder.status === status ? '0 2px 8px rgba(255,107,0,0.10)' : '0 1px 4px rgba(255,107,0,0.04)',
                        transition: 'all 0.18s',
                        '&:hover': {
                          bgcolor: '#FF6B00',
                          color: '#fff',
                          borderColor: '#FF6B00',
                          boxShadow: '0 2px 8px rgba(255,107,0,0.10)',
                          transform: 'scale(1.04)',
                        },
                      }}
                      disabled={updating}
                      onClick={() => updateOrderStatus(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Update Payment Status</Typography>
                  {paymentStatuses.map(payment => (
                    <Button
                      key={payment}
                      variant={selectedOrder.payment === payment ? 'contained' : 'outlined'}
                      fullWidth
                      sx={{
                        mb: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        bgcolor: selectedOrder.payment === payment ? '#FF6B00' : '#fff',
                        color: selectedOrder.payment === payment ? '#fff' : '#FF6B00',
                        borderColor: '#FF6B00',
                        boxShadow: selectedOrder.payment === payment ? '0 2px 8px rgba(255,107,0,0.10)' : '0 1px 4px rgba(255,107,0,0.04)',
                        transition: 'all 0.18s',
                        '&:hover': {
                          bgcolor: '#FF6B00',
                          color: '#fff',
                          borderColor: '#FF6B00',
                          boxShadow: '0 2px 8px rgba(255,107,0,0.10)',
                          transform: 'scale(1.04)',
                        },
                      }}
                      disabled={updating}
                      onClick={() => updatePaymentStatus(payment)}
                    >
                      {payment.charAt(0).toUpperCase() + payment.slice(1)}
                    </Button>
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 2, pt: 1, bgcolor: '#FFF8F2', borderTop: '1.5px solid #FFE0B2' }}>
              <Button
                onClick={handleCloseModal}
                sx={{
                  fontWeight: 700,
                  color: '#FF6B00',
                  border: '2px solid #FF6B00',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(255,107,0,0.04)',
                  transition: 'all 0.18s',
                  '&:hover': {
                    bgcolor: '#FF6B00',
                    color: '#fff',
                    borderColor: '#FF6B00',
                    boxShadow: '0 2px 8px rgba(255,107,0,0.10)',
                    transform: 'scale(1.04)',
                  },
                }}
              >
                CLOSE
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OrdersList; 