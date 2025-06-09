import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { ADD_TO_LIBRARY, REMOVE_FROM_WISHLIST } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';
import '../styles/Wishlist.css';

interface Game {
  rawgId: string;
  name: string;
  released?: string;
  background_image?: string;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_ME);
  const [addToLibrary] = useMutation(ADD_TO_LIBRARY);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  const wishlist: Game[] = data?.me?.wishlist || [];

  const handleAddToLibrary = async (game: Game) => {
    try {
      await addToLibrary({
        variables: {
          gameInput: {
            rawgId: game.rawgId,
            name: game.name,
            released: game.released || '',
            background_image: game.background_image || '',
          },
        },
      });
      alert('Game added to library');
      navigate('/me/library');
    } catch (err) {
      console.error('Failed to add to library:', err);
    }
  };

  const handleRemoveFromWishlist = async (gameId: string) => {
    try {
      await removeFromWishlist({ variables: { gameId } });
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) return <p className="glow-text">Loading your wishlist...</p>;
  if (error) return <p className="glow-text">Error loading wishlist: {error.message}</p>;

  return (
    <main className="page-wrapper">
      <div className="wishlist-container">
        <h1 className="wishlist-title">Wishlist</h1>
        <div className="wishlist-description">
          These are the games you're watching:
        </div>

        {wishlist.length === 0 ? (
          <p className="glow-text">Your wishlist is empty!</p>
        ) : (
          <ul className="wishlist-list">
            {wishlist.map((game) => (
              <li key={`${game.rawgId}-${game.name}`} className="wishlist-item">
                <span
                  className="wishlist-game-title"
                  onClick={() => navigate(`/game/${game.rawgId}`)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {game.name}
                </span>
                <span className="wishlist-release">{game.released || 'TBA'}</span>
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="action-button" onClick={() => handleAddToLibrary(game)} style={{ marginRight: '0.5rem' }}>
                    Add to Library
                  </button>
                  <button className="action-button" onClick={() => handleRemoveFromWishlist(game.rawgId)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
