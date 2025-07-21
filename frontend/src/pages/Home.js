import React, { useState, useEffect, useRef } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const Home = () => {
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1); // State to track the current active step
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const audioRef = useRef(null);

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

  // Function to get step class based on its state
  const getStepClass = (stepNumber) => {
    if (isStepActive(stepNumber)) {
      return 'step-card active';
    } else if (isStepCompleted(stepNumber)) {
      return 'step-card completed';
    } else {
      return 'step-card';
    }
  };

  // Audio welcome messages
  const welcomeMessages = {
    fr: "Bienvenue à Sweqa",
    ar: "مرحباً بكم في Sweqa",
    en: "Welcome to Sweqa"
  };

  // Handle audio play/pause
  const toggleAudio = () => {
    if (isAudioPlaying) {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
    } else {
      // Try to play audio file first
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Fallback to text-to-speech
          playTextToSpeech();
        });
        setIsAudioPlaying(true);
      } else {
        // Use text-to-speech directly
        playTextToSpeech();
      }
    }
  };

  // Text-to-speech fallback
  const playTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(welcomeMessages[currentLanguage]);
      utterance.lang = currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsAudioPlaying(true);
    }
  };

  // Hide welcome animation after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-main-bg">
      {/* WELCOME ANIMATION */}
      {showWelcomeAnimation && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          {/* Audio element */}
          <audio
            ref={audioRef}
            onEnded={() => setIsAudioPlaying(false)}
            style={{ display: 'none' }}
          >
            <source src="/audio/welcome.mp3" type="audio/mpeg" />
          </audio>

          {/* Rotating Cart */}
          <Box
            sx={{
              animation: 'rotateCart 3s ease-in-out infinite',
              mb: 4
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: '120px',
                color: '#FF6B00',
                filter: 'drop-shadow(0 8px 16px rgba(255, 107, 0, 0.4))'
              }}
            />
          </Box>

          {/* Welcome Text */}
          <Typography
            variant="h2"
            sx={{
              color: '#FF6B00',
              fontWeight: 700,
              textAlign: 'center',
              mb: 3,
              animation: 'pulseText 2s ease-in-out infinite',
              textShadow: '0 4px 8px rgba(255, 107, 0, 0.3)'
            }}
          >
            {welcomeMessages[currentLanguage]}
          </Typography>

          {/* Audio Control Button */}
          <Button
            onClick={toggleAudio}
            sx={{
              backgroundColor: 'rgba(255, 107, 0, 0.2)',
              color: '#FF6B00',
              border: '2px solid #FF6B00',
              borderRadius: '50%',
              width: 60,
              height: 60,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 0, 0.3)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isAudioPlaying ? (
              <VolumeOffIcon sx={{ fontSize: 24 }} />
            ) : (
              <VolumeUpIcon sx={{ fontSize: 24 }} />
            )}
          </Button>
        </Box>
      )}

      {/* HERO SECTION */}
      <section className="hero-section">
        <Container maxWidth={false} className="home-container" sx={{ maxWidth: '1400px !important' }}>
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
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(255, 107, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 107, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #FF6B00, #FF8533, #FFA366)',
                }
              }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: '#000', 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FF6B00, #FF8533)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(255, 107, 0, 0.1)'
                }}
                              >
                  {t('heroTitle')}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#666', 
                    mb: 4, 
                    fontWeight: 400,
                    maxWidth: '800px'
                  }} 
                  paragraph
                >
                  {t('heroSubtitle')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B00, #FF8533)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #FF8533, #FFA366)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 0, 0.4)'
                    },
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    boxShadow: '0 6px 20px rgba(255, 107, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none'
                  }}
                >
                  {t('createStoreButton')}
                </Button>
              </Box>
            </Paper>

            <Paper 
              className="store-admin-preview"
              sx={{
                boxShadow: '0 20px 40px rgba(255, 107, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 107, 0, 0.1)',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #FF6B00, #FF8533, #FFA366)',
                }
              }}
            >
              <Box className="sidebar-placeholder">
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    color: '#FF6B00',
                    fontWeight: 700,
                    textShadow: '0 1px 2px rgba(255, 107, 0, 0.1)'
                  }}
                >
                  {t('menu')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    className="menu-item active"
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(255, 133, 51, 0.1))',
                      boxShadow: '0 2px 8px rgba(255, 107, 0, 0.15)',
                      border: '1px solid rgba(255, 107, 0, 0.2)'
                    }}
                  >
                    <StorefrontIcon sx={{ mr: 1, color: '#FF6B00' }} />
                    {t('products')}
                  </Typography>
                  <Typography className="menu-item" sx={{ mt: 1 }}>
                    <ShowChartIcon sx={{ mr: 1 }} />
                    {t('statistics')}
                  </Typography>
                  <Typography className="menu-item" sx={{ mt: 1 }}>
                    <DesktopMacIcon sx={{ mr: 1 }} />
                    {t('personalization')}
                  </Typography>
                  <Typography className="menu-item" sx={{ mt: 1 }}>
                    <HelpOutlineIcon sx={{ mr: 1 }} />
                    {t('assistance')}
                  </Typography>
                </Box>
                <Paper 
                  className="boost-section" 
                  sx={{ 
                    mt: 4, 
                    p: 2, 
                    background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
                    borderRadius: 2, 
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(255, 107, 0, 0.15)',
                    border: '1px solid rgba(255, 107, 0, 0.2)'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#FF6B00' }}>
                    {t('boostTitle')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                                          {t('boostDescription')}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #FF6B00, #FF8533)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #FF8533, #FFA366)',
                        transform: 'translateY(-1px)'
                      },
                      boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                                          {t('discoverButton')}
                  </Button>
                </Paper>
              </Box>

              <Box className="products-list-placeholder">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      color: '#FF6B00',
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(255, 107, 0, 0.1)'
                    }}
                  >
                    {t('myProducts')}
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #FF6B00, #FF8533)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #FF8533, #FFA366)',
                        transform: 'translateY(-1px)'
                      },
                      boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      borderRadius: '8px'
                    }}
                  >
                    <AddIcon sx={{ mr: 0.5 }} /> {t('addProduct')}
                  </Button>
                </Box>
                <Box className="products-scroll-container">
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item}>
                        <Paper 
                          className="product-card-placeholder"
                          sx={{
                            boxShadow: '0 8px 20px rgba(255, 107, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
                            border: '1px solid rgba(255, 107, 0, 0.1)',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 30px rgba(255, 107, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.1)',
                            }
                          }}
                        >
                          <Box className="product-image-placeholder">
                            <ImageIcon />
                          </Box>
                          <Box className="product-card-content">
                            <Typography variant="subtitle1" className="product-name-placeholder">
                              {t('productName')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="product-price-placeholder">
                                                              {t('productPrice')}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        className="add-product-card"
                        sx={{
                          background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
                          border: '2px dashed #FF6B00',
                          boxShadow: '0 4px 12px rgba(255, 107, 0, 0.15)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #FFE0B2, #FFCC80)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(255, 107, 0, 0.25)',
                          }
                        }}
                      >
                        <AddIcon className="add-product-icon" />
                        <Typography variant="subtitle1">{t('addNewProduct')}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Paper 
                  className="ai-feature-banner" 
                  sx={{ 
                    mt: 4, 
                    p: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(33, 150, 243, 0.15), 0 4px 8px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #2196F3, #42A5F5, #64B5F6)',
                    }
                  }}
                >
                  <HelpOutlineIcon sx={{ mr: 2, color: '#1976D2', fontSize: '2rem' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976D2', mb: 1 }}>
                      {t('aiBannerTitle')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                                              {t('aiBannerDescription')}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #2196F3, #42A5F5)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #42A5F5, #64B5F6)',
                        transform: 'translateY(-1px)'
                      },
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                      transition: 'all 0.3s ease',
                      borderRadius: '8px'
                    }}
                  >
                                          {t('tryButton')}
                  </Button>
                </Paper>
              </Box>
            </Paper>
          </Box>
        </Container>
      </section>

      {/* AI SECTION */}
      <section className="feature-section ai-feature">
        <div className="feature-text">
          <h2>{t('aiTitle')}</h2>
          <p>{t('aiDescription')}</p>
          <button className="cta-btn secondary">{t('aiButton')}</button>
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
          <h2>{t('discoverTitle')}</h2>
          <p>{t('discoverDescription')}</p>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2>{t('howItWorksTitle')}</h2>
        <p>{t('howItWorksSubtitle')}</p>
        <div className="steps-row">
          <div className={getStepClass(1)}>
            <div className="step-number">1</div>
            <h3>{t('step1Title')}</h3>
            <p>{t('step1Description')}</p>
          </div>
          <div className={getStepClass(2)}>
            <div className="step-number">2</div>
            <h3>{t('step2Title')}</h3>
            <p>{t('step2Description')}</p>
          </div>
          <div className={getStepClass(3)}>
            <div className="step-number">3</div>
            <h3>{t('step3Title')}</h3>
            <p>{t('step3Description')}</p>
          </div>
        </div>
        <button className="cta-btn">{t('createStoreNow')}</button>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <h2>{t('testimonialsTitle')}</h2>
        <hr className="divider" />
        <div className="testimonials-row">
          <div className="testimonial">
            <img src="/assets/figma/fatima.jpg" alt="Fatima Zohra" />
            <div className="testimonial-info">
              <span className="name">Fatima Zohra</span>
              <span className="role">Entrepreneur</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>{t('testimonial1')}</p>
          </div>
          <div className="testimonial">
            <img src="/assets/figma/mehdi.jpg" alt="Mehdi El Idrissi" />
            <div className="testimonial-info">
              <span className="name">Mehdi El Idrissi</span>
              <span className="role">Boutique Owner</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>{t('testimonial2')}</p>
          </div>
          <div className="testimonial">
            <img src="/assets/figma/amina.jpg" alt="Amina Tazi" />
            <div className="testimonial-info">
              <span className="name">Amina Tazi</span>
              <span className="role">Startup Founder</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>{t('testimonial3')}</p>
          </div>
          <div className="testimonial">
            <img src="/assets/figma/karim.jpg" alt="Karim Benjelloun" />
            <div className="testimonial-info">
              <span className="name">Karim Benjelloun</span>
              <span className="role">E-commerce Specialist</span>
            </div>
            <div className="stars">★★★★★</div>
            <p>{t('testimonial4')}</p>
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
        <h2>{t('finalCTATitle')}</h2>
        <button className="cta-btn">{t('startFree')}</button>
      </section>
    </div>
  );
};

export default Home; 