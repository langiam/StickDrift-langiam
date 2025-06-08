import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import GameSearchBar from './components/GameSearchBar';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GameView from './pages/GameView';
import Wishlist from './pages/Wishlist';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import Search from './pages/Search'; // This renders RAWG search results

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <SearchBar />
          <GameSearchBar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/game/:id" element={<GameView />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/profile/:profileId" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
