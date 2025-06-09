import { useState } from 'react';
import { Link } from 'react-router-dom';
import UnifiedSearchBar from './UnifiedSearchBar';
import '../styles/Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-header">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            🎮 StickDrift
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        <UnifiedSearchBar />

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/me" onClick={closeMenu}>My Profile</Link>
          <Link to="/library" onClick={closeMenu}>Library</Link>
          <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
          <Link to="/playlist" onClick={closeMenu}>Playlist</Link>
        </div>
      </div>
    </nav>
  );
}
