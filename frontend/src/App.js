import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import NavBar from './components/NavBar';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateStore from './pages/CreateStore';
import StoreAdmin from './pages/StoreAdmin';
import StoreFront from './pages/StoreFront';
import PrivateRoute from './components/PrivateRoute';
import ProductDetails from './components/ProductDetails';
import CheckoutPage from './pages/CheckoutPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B00',
      light: '#FF8533',
      dark: '#CC5500',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#FFF3E0', // Light orange background
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          '&:hover': {
            backgroundColor: '#FF8533',
          },
        },
        outlined: {
          borderColor: '#FF6B00',
          color: '#FF6B00',
          '&:hover': {
            borderColor: '#FF8533',
            color: '#FF8533',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
});

function App() {
  const location = useLocation();
  const [openCreateStore, setOpenCreateStore] = useState(false);
  const isStoreFrontRoute = location.pathname.startsWith('/store/') && !location.pathname.includes('/store-admin/');
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  // Extract storeSlug from the path for keying
  let storeSlug = null;
  if (isStoreFrontRoute) {
    const match = location.pathname.match(/^\/store\/([^/]+)/);
    if (match) storeSlug = match[1];
  }

  // Show navbar based on route type
  const showNavbar = () => {
    if (isAuthRoute) return null; // No navbar for auth pages
    if (isStoreFrontRoute) return null; // No navbar for store pages
    if (location.pathname.startsWith('/checkout')) return null; // No navbar for checkout
    if (/^\/store\/[^/]+\/cart/.test(location.pathname)) return null; // No navbar for store cart
    return <NavBar />; // Use the new NavBar for all other pages
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="App">
              {showNavbar()}
              <main className={isAuthRoute ? '' : 'main-content'}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard onCreateStore={() => setOpenCreateStore(true)} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/create-store"
                    element={<CreateStore open={true} onClose={() => window.history.back()} />}
                  />
                  <Route
                    path="/store-admin/:storeId/*"
                    element={
                      <PrivateRoute>
                        <StoreAdmin />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/store/:storeSlug/product/:productId" element={<ProductDetails />} />
                  <Route path="/store/:storeSlug/checkout" element={<CheckoutPage />} />
                  <Route path="/store/:storeSlug/*" element={<StoreFront />} />
                  <Route path="/store/:storeSlug/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/products" element={<div>Products Page</div>} />
                  <Route path="/about" element={<div>About Page</div>} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
                <CreateStore open={openCreateStore} onClose={() => setOpenCreateStore(false)} />
              </main>
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
