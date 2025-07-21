import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { Language as LanguageIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    handleClose();
  };

  const languages = [
    { code: 'fr', name: t('french'), flag: '🇫🇷' },
    { code: 'ar', name: t('arabic'), flag: '🇸🇦' },
    { code: 'en', name: t('english'), flag: '🇺🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#FF6B00',
          backgroundColor: 'rgba(255, 107, 0, 0.1)',
          border: '2px solid rgba(255, 107, 0, 0.2)',
          borderRadius: '12px',
          px: 2,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(255, 107, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 0, 0.15)',
            borderColor: 'rgba(255, 107, 0, 0.4)',
            boxShadow: '0 6px 20px rgba(255, 107, 0, 0.25)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <LanguageIcon sx={{ fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {currentLang?.flag} {currentLang?.name}
        </Typography>
        <ExpandMoreIcon sx={{ fontSize: 16 }} />
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 107, 0, 0.1)',
            overflow: 'hidden'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={currentLanguage === language.code}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 3,
              py: 2,
              minWidth: 150,
              backgroundColor: currentLanguage === language.code ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
              color: currentLanguage === language.code ? '#FF6B00' : '#333',
              fontWeight: currentLanguage === language.code ? 600 : 400,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 0, 0.05)',
                color: '#FF6B00'
              }
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
              {language.flag}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
              {language.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
