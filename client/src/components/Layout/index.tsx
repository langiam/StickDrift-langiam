import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar'; // ⬅️ use Navbar instead of Header
import Footer from '../Footer';
import { ToastContainer } from 'react-toastify';
import '../../styles/SearchBar.css';

const Layout = () => (
  <>
    <Navbar /> {/* ✅ this includes the search bar and nav */}
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
