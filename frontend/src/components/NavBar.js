import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-custom">
      <div className="navbar-logo navbar-logo-left">
        <Link to="/">
          <span className="logo-orange">Sweqa</span>
        </Link>
      </div>
      <div className="navbar-actions">
        {!user ? (
          <Link to="/login" className="navbar-auth-btn">Se connecter</Link>
        ) : (
          <button className="navbar-auth-btn" onClick={logout}>Déconnexion</button>
        )}
      </div>
    </nav>
  );
} 