// client/src/components/Footer/index.tsx

import { useLocation, useNavigate } from 'react-router-dom';
import './Footer.css'; // Ensure this path matches where you saved Footer.css

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {location.pathname !== '/' && (
          <button className="footer-back-button" onClick={handleGoBack}>
            &larr; Go Back
          </button>
        )}
        <h4 className="footer-copy">
          &copy; {new Date().getFullYear()} – Project Three Team
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
