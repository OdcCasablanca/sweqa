import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Alert,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { FaLock } from 'react-icons/fa';
import NavBar from '../components/NavBar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              width: '100%',
              maxWidth: 950,
              minHeight: 'auto',
              height: 500,
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            <Grid container component="main" sx={{ height: 500 }}>
              {/* Left Side */}
              <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                  backgroundColor: '#FF6B00',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  height: 500,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                  }}
                >
                  <FaLock size={80} style={{ marginBottom: 24 }} />
                  <Typography variant="h4" component="h1" gutterBottom>
                    Bienvenue
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ maxWidth: 400 }}>
                    Connectez-vous pour accéder à votre tableau de bord et gérer votre boutique en ligne.
                  </Typography>
                </Box>
              </Grid>
              {/* Right Side */}
              <Grid
                item
                xs={12}
                sm={8}
                md={6}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent', height: 500 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                  }}
                >
                  <Typography component="h1" variant="h5" sx={{ color: '#FF6B00', mb: 3, textAlign: 'center' }}>
                    Connexion
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Adresse e-mail"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Mot de passe"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 3,
                        mb: 2,
                        bgcolor: '#FF6B00',
                        '&:hover': { bgcolor: '#FF8533' },
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Connexion en cours...' : 'SE CONNECTER'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link
                          component={RouterLink}
                          to="/register"
                          variant="body2"
                          sx={{ color: '#FF6B00' }}
                        >
                          Pas encore de compte ? Inscrivez-vous
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Login; 