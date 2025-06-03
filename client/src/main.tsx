// client/src/main.tsx
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SearchPage from './pages/Search';    // ← make sure this is "./pages/Search"
import Library from './pages/Library';
import Calendar from './pages/Calendar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ErrorPage from './pages/Error';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      { path: 'signup', element: <Signup /> },
      { path: 'login', element: <Login /> },

      // Protected routes
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/:profileId',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'search',
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'library',
        element: (
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        ),
      },
      {
        path: 'calendar',
        element: (
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        ),
      },

      // Fallback for any unmatched path
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
