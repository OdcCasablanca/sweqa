import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const themes = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design with focus on product presentation',
    preview: '/theme-previews/modern.jpg',
    colors: {
      primary: '#FF6B00',
      secondary: '#1a1a1a',
      background: '#FFFFFF',
      text: '#1a1a1a',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with premium look and feel',
    preview: '/theme-previews/elegant.jpg',
    colors: {
      primary: '#9C6F44',
      secondary: '#2C2C2C',
      background: '#F8F8F8',
      text: '#2C2C2C',
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong visual impact with vibrant colors',
    preview: '/theme-previews/bold.jpg',
    colors: {
      primary: '#E41E31',
      secondary: '#000000',
      background: '#FFFFFF',
      text: '#000000',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic feel with earth tones and natural elements',
    preview: '/theme-previews/nature.jpg',
    colors: {
      primary: '#4CAF50',
      secondary: '#2E7D32',
      background: '#F5F8F5',
      text: '#1B5E20',
    },
  },
];

const StoreThemes = ({ currentTheme, onThemeSelect }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1a1a1a' }}>
        Store Themes
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Choose a theme that best represents your brand
      </Typography>

      <Grid container spacing={3}>
        {themes.map((themeOption) => (
          <Grid item xs={12} sm={6} md={3} key={themeOption.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
                border: currentTheme === themeOption.id ? `2px solid ${themeOption.colors.primary}` : 'none',
              }}
              onClick={() => onThemeSelect(themeOption.id)}
            >
              <CardMedia
                component="img"
                height="160"
                image={themeOption.preview}
                alt={themeOption.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={currentTheme === themeOption.id}
                        sx={{
                          '&.Mui-checked': {
                            color: themeOption.colors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {themeOption.name}
                      </Typography>
                    }
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {themeOption.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {Object.entries(themeOption.colors).map(([key, color]) => (
                    <Box
                      key={key}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: color,
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </Box>
                {currentTheme === themeOption.id && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CheckIcon />}
                    sx={{
                      bgcolor: themeOption.colors.primary,
                      '&:hover': {
                        bgcolor: themeOption.colors.primary,
                        opacity: 0.9,
                      },
                    }}
                  >
                    Selected
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StoreThemes; 