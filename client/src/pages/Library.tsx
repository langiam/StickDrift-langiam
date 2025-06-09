import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../styles/Library.css';

interface Game {
  _id: string;
  rawgId: string;
  name: string;
  released?: string;
  background_image?: string;
}

const Library: React.FC = () => {
  const { loading, error, data } = useQuery(QUERY_ME);

  if (loading) return <p className="glow-text">Loading your library...</p>;
  if (error) {
    console.error('GraphQL error:', error);
    return <p className="glow-text">Error loading library: {error.message}</p>;
  }

  const library: Game[] = data?.me?.library || [];

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
              <li key={game._id} className="library-item">
                {game.background_image && (
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="library-game-image"
                  />
                )}
                <div className="library-game-info">
                  <span className="library-game-title">{game.name}</span>
                  <span className="library-release">{game.released || 'Unknown Release Date'}</span>
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
