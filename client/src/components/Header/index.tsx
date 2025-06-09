// client/src/components/Header/index.tsx

import { Link, useNavigate } from "react-router-dom";
import UnifiedSearchBar from "../UnifiedSearchBar";
import './Header.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">

        {/* Logo / Title with glitch effect */}
        <Link to="/" className="logo">
          <div className="glitch-horizontal" data-text="StickDrift">
            StickDrift
          </div>
        </Link>

        {/* Unified search bar (with toggle) */}
        <div className="header-search">
          <UnifiedSearchBar />
        </div>

        {/* Navigation links */}
        <nav className="nav-links">
          <button onClick={() => navigate("/me")}>My Profile</button>
          <button
            onClick={() => {
              localStorage.removeItem("id_token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </nav>
        
      </div>
    </header>
  );
}
