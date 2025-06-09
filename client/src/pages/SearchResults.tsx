import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TO_LIBRARY, ADD_TO_WISHLIST, ADD_TO_PLAYLIST } from '../utils/mutations';
import Auth from '../utils/auth';
import '../styles/SearchResults.css';
import { useNavigate, useLocation } from 'react-router-dom';

interface Game {
  id: number;
  name: string;
  released?: string;
  background_image?: string;
}

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  const [addToLibrary] = useMutation(ADD_TO_LIBRARY);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [addToPlaylist] = useMutation(ADD_TO_PLAYLIST);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/rawg/games?search=${searchTerm}&page_size=10`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleAdd = async (game: Game, type: 'library' | 'wishlist' | 'playlist') => {
    if (!Auth.loggedIn()) return alert('You must be logged in to add games.');

    const variables = {
      gameInput: {
        id: game.id,
        name: game.name,
        released: game.released,
        background_image: game.background_image,
      },
    };

    try {
      if (type === 'library') {
        await addToLibrary({ variables });
        alert('Added to Library');
      } else if (type === 'wishlist') {
        await addToWishlist({ variables });
        const confirm = window.confirm('Game added to wishlist. Add to library too?');
        if (confirm) {
          await addToLibrary({ variables });
          navigate('/me/library');
        }
      } else if (type === 'playlist') {
        await addToLibrary({ variables });
        await addToPlaylist({ variables });
        alert('Added to Playlist and Library');
      }
    } catch (err) {
      console.error(`Error adding to ${type}:`, err);
      alert(`Failed to add to ${type}`);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="results-container">
        <h2 className="results-title">Search Results</h2>
        {loading ? (
          <p className="glow-text">Loading...</p>
        ) : results.length === 0 ? (
          <p className="glow-text">No results found.</p>
        ) : (
          <ul className="results-list">
            {results.map((game) => (
              <li key={game.id} className="result-item">
                <div className="game-info">
                  <div className="game-title">{game.name}</div>
                  <div className="game-release">{game.released || 'Unknown'}</div>
                </div>
                <div className="action-buttons">
                  <button onClick={() => handleAdd(game, 'library')}>Add to Library</button>
                  <button onClick={() => handleAdd(game, 'wishlist')}>Add to Wishlist</button>
                  <button onClick={() => handleAdd(game, 'playlist')}>Add to Playlist</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default SearchResults;
