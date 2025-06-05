// client/src/components/Footer/index.tsx
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <p>© {new Date().getFullYear()} StickDrift. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
