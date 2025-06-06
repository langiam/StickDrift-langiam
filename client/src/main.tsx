// client/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import client from './utils/apolloClient'; // ← Must point at the file above, not elsewhere
import App from './App.jsx';
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {
        path: "me",
        element: <Profile />,
        children: [
          { path: "wishlist", element: <Wishlist /> },
          { path: "calendar", element: <Calendar month={6} year={2025} /> },
          { path: "library", element: <Library /> },
          { path: "followers", element: <Followers /> },
          { path: "gamecollection", element: <GameCollections /> },
          { path: "playlist", element: <Playlist /> },
        ],
      },
      {
        path: "profiles/:profileId",
        element: <Profile />,
        children: [
          { path: "wishlist", element: <Wishlist /> },
          { path: "calendar", element: <Calendar month={6} year={2025} /> },
          { path: "library", element: <Library /> },
          { path: "followers", element: <Followers /> },
          { path: "gamecollection", element: <GameCollections /> },
          { path: "playlist", element: <Playlist /> },
        ],
      },
    ],
  },
]);

const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
