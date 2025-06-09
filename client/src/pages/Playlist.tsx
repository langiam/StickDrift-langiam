import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_FROM_PLAYLIST } from '../utils/mutations';
import GameActionButtons from '../components/GameActions';
import '../styles/Playlist.css';

interface GameItem {
  _id: string;
  rawgId: string;
  name: string;
  released?: string;
  background_image?: string;
  status?: string;
}

const Playlist: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(QUERY_ME);
  const [removeFromPlaylist] = useMutation(REMOVE_FROM_PLAYLIST);
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const me = data?.me;
  const playlist: GameItem[] = me?.playlist || [];

  const handleStatusChange = (rawgId: string, newStatus: string) => {
    setStatuses((prev) => ({
      ...prev,
      [rawgId]: newStatus,
    }));
    // Optional: Persist status mutation
  };

  const handleRemove = async (rawgId: string) => {
    try {
      await removeFromPlaylist({ variables: { gameId: rawgId } });
      await refetch();
    } catch (err) {
      console.error('Failed to remove from playlist:', err);
    }
  };

  if (loading) return <p className="glow-text">Loading your playlist...</p>;
  if (error || !me) return <p className="glow-text">Error loading playlist.</p>;

  return (
    <main className="page-wrapper">
      <div className="playlist-container">
        <h1 className="playlist-title">My Playlist</h1>

        {playlist.length === 0 ? (
          <p className="glow-text">No games in your playlist yet!</p>
        ) : (
          <ul className="playlist-items">
            {playlist.map((game) => (
              <li key={game._id} className="playlist-item">
                <span
                  className="playlist-game-title"
                  onClick={() => navigate(`/game/${game.rawgId}`)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {game.name}
                </span>
                <p className="song-artist">
                  {game.released || 'Release date N/A'}
                </p>
                <select
                  className="status-select"
                  value={statuses[game.rawgId] || 'PLAYING'}
                  onChange={(e) => handleStatusChange(game.rawgId, e.target.value)}
                >
                  <option value="PLAYING">Playing</option>
                  <option value="PAUSED">Paused</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <GameActionButtons onRemove={() => handleRemove(game.rawgId)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Playlist;
