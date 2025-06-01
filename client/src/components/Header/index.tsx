import { Link } from 'react-router-dom';
import { type MouseEvent } from 'react';
import Auth from '../../utils/auth';
import "./Header.css";
// import 'animate.css';
import logo from '../../assets/stickdrift-logo.png';
const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
        <img src={logo} alt="Stickdrift Logo" className="logo-image animate__animated animate__fadeInDown" />

        <h1 className="glitch-text" data-text="Stickdrift">
  Stickdrift
</h1>

        </Link>
        <nav className="nav-links">
          {Auth.loggedIn() ? (
            <>
              <Link to="/me">View My Profile</Link>
              <button onClick={logout} aria-label="Logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
