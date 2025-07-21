import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-custom">
      <div className="navbar-logo navbar-logo-left">
        <Link to="/">
          <span className="logo-orange">Sweqa</span>
        </Link>
      </div>
      <div className="navbar-actions">
        <Box sx={{ mr: 2 }}>
          <LanguageSwitcher />
        </Box>
        {!user ? (
          <Link to="/login" className="navbar-auth-btn">{t('login')}</Link>
        ) : (
          <button className="navbar-auth-btn" onClick={logout}>{t('logout')}</button>
        )}
      </div>
    </nav>
  );
} 