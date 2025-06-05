// client/src/components/Header/index.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthService from '../../utils/auth';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const loggedIn = AuthService.loggedIn();

  const handleLogout = () => {
    AuthService.logout();
    window.location.assign('/');
  };

  return (
    <header className="header-container">
      <nav className="header-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>

        <Link
          to="/search"
          className={location.pathname.startsWith('/search') ? 'active' : ''}
        >
          Search
        </Link>

        {loggedIn ? (
          <>
            <Link
              to="/library"
              className={location.pathname === '/library' ? 'active' : ''}
            >
              Library
            </Link>

            <Link
              to="/calendar"
              className={location.pathname === '/calendar' ? 'active' : ''}
            >
              Calendar
            </Link>

            <Link
              to={`/profile/${AuthService.getProfile().data._id}`}
              className={location.pathname.startsWith('/profile') ? 'active' : ''}
            >
              My Profile
            </Link>

            <button type="button" className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={location.pathname === '/signup' ? 'active' : ''}
            >
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
