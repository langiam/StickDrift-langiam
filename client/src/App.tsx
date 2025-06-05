// client/src/App.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />

      {/* The Outlet will render whichever child route is active */}
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default App;
