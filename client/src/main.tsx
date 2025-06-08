import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import client from './utils/apolloClient';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ErrorPage from './pages/Error';
import Wishlist from './pages/Wishlist';
import Calendar from './pages/Calendar';
import Library from './pages/Library';
import Followers from './pages/Followers';
import GameCollections from './pages/GameCollections';
import Playlist from './pages/Playlist';
import GameView from './pages/GameView';
import SearchResults from './pages/SearchResults';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'search', element: <SearchResults /> },
      {
        path: 'me',
        element: <Profile />,
        children: [
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'calendar', element: <Calendar /> },
          { path: 'library', element: <Library /> },
          { path: 'followers', element: <Followers /> },
          { path: 'gamecollection', element: <GameCollections /> },
          { path: 'playlist', element: <Playlist /> },
        ],
      },
      {
        path: 'profiles/:profileId',
        element: <Profile />,
        children: [
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'calendar', element: <Calendar /> },
          { path: 'library', element: <Library /> },
          { path: 'followers', element: <Followers /> },
          { path: 'gamecollection', element: <GameCollections /> },
          { path: 'playlist', element: <Playlist /> },
        ],
      },
      { path: 'game/:id', element: <GameView /> },
    ],
  },
]);

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
