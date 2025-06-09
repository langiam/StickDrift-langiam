import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { ToastContainer } from 'react-toastify';
import '../../styles/SearchBar.css';

const Layout = () => (
  <>
    <Header />
    <main className="container">
      <Outlet />
    </main>
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      pauseOnHover
      theme="dark"
      aria-label="Notification messages"
    />
  </>
);

export default Layout;
