import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Home = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1); // State to track the current active step

  // Example: Automatically advance the step every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep < 3 ? prevStep + 1 : 1));
    }, 3000); // Change step every 3 seconds
    return () => clearInterval(timer);
  }, []);

  // Function to determine if a step is completed (for displaying checkmark)
  const isStepCompleted = (stepNumber) => {
    return stepNumber < currentStep; // A step is completed if the active step has moved past it
  };

  // Function to determine if a step is active (for applying active-step class)
  const isStepActive = (stepNumber) => {
    return stepNumber === currentStep;
  };

  return (
    <div className="home-main-bg">
      {/* HERO SECTION */}
      <section className="hero-section">
        <Container maxWidth="lg" className="home-container">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Paper
              sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderRadius: 2,
                boxShadow: 'none',
              }}
            >
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#000', fontWeight: 700 }}>
                Crée ta boutique en ligne en 2 minutes avec Sweqa
              </Typography>
              <Typography variant="h5" sx={{ color: '#000000', mb: 4, fontWeight: 400 }} paragraph>
                Lance ton commerce sans compétence technique avec un nom de domaine personnalisé
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    bgcolor: '#FF6B00',
                    '&:hover': { bgcolor: '#FF8533' },
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Créer ma boutique gratuitement
                </Button>
              </Box>
            </Paper>

            <Paper className="store-admin-preview">
              <Box className="sidebar-placeholder">
                <Typography variant="h6" gutterBottom>Menu</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography className="menu-item active"><StorefrontIcon sx={{ mr: 1 }} />Produits</Typography>
                  <Typography className="menu-item" sx={{ mt: 1 }}><ShowChartIcon sx={{ mr: 1 }} />Statistiques</Typography>
                  <Typography className="menu-item" sx={{ mt: 1 }}><DesktopMacIcon sx={{ mr: 1 }} />Personnalisation</Typography>
                  <Typography className="menu-item" sx={{ mt: 1 }}><HelpOutlineIcon sx={{ mr: 1 }} />Assistance</Typography>
                </Box>
                <Paper className="boost-section" sx={{ mt: 4, p: 2, backgroundColor: '#ffeacc', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Boost ta visibilité</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Découvre Sweqa Discover pour plus de trafic</Typography>
                  <Button variant="contained" size="small" sx={{ bgcolor: '#FF6B00' }}>Découvrir</Button>
                </Paper>
              </Box>

              <Box className="products-list-placeholder">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" gutterBottom>Mes produits</Typography>
                  <Button variant="contained" size="small" sx={{ bgcolor: '#FF6B00' }}><AddIcon sx={{ mr: 0.5 }} /> Ajouter un produit</Button>
                </Box>
                <Box className="products-scroll-container">
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item}>
                        <Paper className="product-card-placeholder">
                          <Box className="product-image-placeholder">
                            <ImageIcon />
                          </Box>
                          <Box className="product-card-content">
                            <Typography variant="subtitle1" className="product-name-placeholder">Caftan traditionnel</Typography>
                            <Typography variant="body2" color="textSecondary" className="product-price-placeholder">450 MAD</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper className="add-product-card">
                        <AddIcon className="add-product-icon" />
                        <Typography variant="subtitle1">Ajouter un nouveau produit</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Paper className="ai-feature-banner" sx={{ mt: 4, p: 2, display: 'flex', alignItems: 'center', backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                  <HelpOutlineIcon sx={{ mr: 2, color: '#1e88e5' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Téléverse une image et l'IA remplit les détails</Typography>
                    <Typography variant="body2">Notre assistant IA analyse tes photos et remplit automatiquement les informations produit</Typography>
                  </Box>
                  <Button variant="contained" size="small" sx={{ bgcolor: '#2196f3' }}>Essayer</Button>
                </Paper>
              </Box>
            </Paper>
          </Box>
        </Container>
      </section>

      {/* AI SECTION */}
      <section className="feature-section ai-feature">
        <div className="feature-text">
          <h2>Ajoute des produits en un clic grâce à l'IA</h2>
          <p>Téléverse une image, Sweqa fait le reste.</p>
          <button className="cta-btn secondary">Découvrir l'IA</button>
        </div>
        <div className="feature-image">
          <img src="/assets/figma/ai-hero-section.png" alt="Ajout produit IA" />
        </div>
      </section>

      {/* DISCOVER SECTION */}
      <section className="feature-section discover-feature">
        <div className="feature-image">
          <img src="/assets/figma/discover-section.png" alt="Sweqa Discover Mobile" />
        </div>
        <div className="feature-text">
          <h2>Produits affichés aléatoirement, redirection vers les boutiques, + de trafic, + de ventes</h2>
          <p>Boost ta visibilité avec Sweqa Discover</p>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2>Comment ça marche</h2>
        <p>Ouvrez votre boutique en ligne en seulement trois étapes simples</p>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Crée ta boutique</h3>
            <p>Quelques clics pour lancer ton e-commerce avec un site personnalisé.</p>
          </div>
          <div className="step-card active">
            <div className="step-number">2</div>
            <h3>Ajoute tes produits</h3>
            <p>L'IA de Sweqa analyse tes photos et remplit les détails automatiquement.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Vends et sois visible</h3>
            <p>Tes produits apparaissent sur Sweqa Discover pour plus de clients.</p>
          </div>
        </div>
        <button className="cta-btn">Créer ma boutique maintenant</button>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <h2>Ce que disent nos utilisateurs</h2>
        <hr className="divider" />
        <div className="testimonials-row">
          <div className="testimonial">
            <img src="/assets/figma/fatima.jpg" alt="Fatima Zohra" />
            <div className="testimonial-info">
              <span className="name">Fatima Zohra</span>
              <span className="role">Entrepreneur</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>Sweqa a transformé mon business en ligne!</p>
          </div>
          <div className="testimonial">
            <img src="/assets/figma/mehdi.jpg" alt="Mehdi El Idrissi" />
            <div className="testimonial-info">
              <span className="name">Mehdi El Idrissi</span>
              <span className="role">Boutique Owner</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>Facile à utiliser et très efficace.</p>
          </div>
          <div className="testimonial">
            <img src="/assets/figma/amina.jpg" alt="Amina Tazi" />
            <div className="testimonial-info">
              <span className="name">Amina Tazi</span>
              <span className="role">Startup Founder</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>Une solution incroyable pour les startups.</p>
          </div>
          <div className="testimonial">
            <img src="/assets/figma/karim.jpg" alt="Karim Benjelloun" />
            <div className="testimonial-info">
              <span className="name">Karim Benjelloun</span>
              <span className="role">E-commerce Specialist</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>Je recommande vivement Sweqa.</p>
          </div>
        </div>
        <div className="pagination">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="final-cta-section">
        <h2>Prêt à vendre en ligne ? Crée ta boutique maintenant.</h2>
        <button className="cta-btn">Démarrer gratuitement</button>
      </section>
    </div>
  );
};

export default Home; 