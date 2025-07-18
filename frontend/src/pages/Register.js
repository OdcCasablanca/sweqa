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
import { PersonAddOutlined as PersonAddIcon } from '@mui/icons-material';
import NavBar from '../components/NavBar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Échec de la création du compte');
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
              height: 600,
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            {/* Left Section with Icon */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                p: 4,
                height: 600,
              }}
            >
              <PersonAddIcon sx={{ fontSize: 80, mb: 3 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Rejoignez-nous
              </Typography>
              <Typography variant="body1" align="center" sx={{ maxWidth: 400 }}>
                Créez votre compte pour commencer à vendre en ligne et développer votre entreprise.
              </Typography>
            </Box>

            {/* Right Section with Form */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 4,
                height: 600,
                overflow: 'auto',
              }}
            >
              <Typography component="h1" variant="h5" sx={{ color: '#FF6B00', mb: 3, textAlign: 'center' }}>
                Inscription
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
                  id="name"
                  label="Nom complet"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse e-mail"
                  name="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to="/login"
                      variant="body2"
                      sx={{ color: '#FF6B00' }}
                    >
                      Déjà un compte ? Connectez-vous
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Register; 