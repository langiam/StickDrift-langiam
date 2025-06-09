import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { ADD_TO_PLAYLIST, REMOVE_FROM_LIBRARY } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';
import '../styles/Library.css';

interface Game {
  rawgId: string;
  name: string;
  released?: string;
  background_image?: string;
}

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_ME);
  const [addToPlaylist] = useMutation(ADD_TO_PLAYLIST);
  const [removeFromLibrary] = useMutation(REMOVE_FROM_LIBRARY);

  const library: Game[] = data?.me?.library || [];

  const handleAddToPlaylist = async (game: Game) => {
    try {
      await addToPlaylist({
        variables: {
          gameInput: {
            id: game.rawgId,
            name: game.name,
            released: game.released,
            background_image: game.background_image,
          },
        },
      });
      alert('Game added to playlist');
    } catch (err) {
      console.error('Failed to add to playlist:', err);
    }
  };

  const handleRemoveFromLibrary = async (gameId: string) => {
    try {
      await removeFromLibrary({ variables: { gameId } });
    } catch (err) {
      console.error('Failed to remove from library:', err);
    }
  };

  if (loading) return <p className="glow-text">Loading your library...</p>;
  if (error) return <p className="glow-text">Error loading library: {error.message}</p>;

  return (
    <main className="page-wrapper">
      <div className="library-container">
        <h1 className="library-title">Library</h1>
        <div className="library-description">
          <p>Here are the games you've added to your library:</p>
        </div>

        {library.length === 0 ? (
          <p className="glow-text">Your library is empty! Add some games to see them here.</p>
        ) : (
          <ul className="library-list">
            {library.map((game) => (
              <li key={game.rawgId} className="library-item">
                <span
                  className="library-game-title"
                  onClick={() => navigate(`/game/${game.rawgId}`)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {game.name}
                </span>
                <span className="library-release">{game.released || 'Unknown Release Date'}</span>
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="action-button" onClick={() => handleAddToPlaylist(game)} style={{ marginRight: '0.5rem' }}>Add to Playlist</button>
                  <button className="action-button" onClick={() => handleRemoveFromLibrary(game.rawgId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Library;
