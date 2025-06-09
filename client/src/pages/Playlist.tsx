import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Playlist.css';

interface Game {
  id: number;
  name: string;
  released?: string;
  genres?: { name: string }[];
}

const Playlist: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=10`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching playlist:', err);
      }
    };

    fetchPlaylist();
  }, [apiKey]);

  const handleStatusChange = (gameId: number, newStatus: string) => {
    setStatuses((prev) => ({
      ...prev,
      [gameId]: newStatus,
    }));
  };

  const handleRemove = (gameId: number) => {
    setGames((prev) => prev.filter((game) => game.id !== gameId));
    const newStatuses = { ...statuses };
    delete newStatuses[gameId];
    setStatuses(newStatuses);
  };

  return (
    <main className="page-wrapper">
      <div className="playlist-container">
        <h1 className="playlist-title">My Playlist</h1>

        {games.length === 0 ? (
          <p className="glow-text">No games in your playlist yet!</p>
        ) : (
          <ul className="playlist-items">
            {games.map((game) => (
              <li key={`${game.id}-${game.name}`} className="playlist-item">
                <div className="playlist-info">
                  <Link to={`/game/${game.id}`} className="playlist-game-title">
                    {game.name}
                  </Link>
                  <p className="song-artist">
                    {game.genres?.map((g) => g.name).join(', ') || 'Unknown Genre'}<br />
                    {game.released || 'Release date N/A'}
                  </p>
                </div>
                <div className="playlist-actions">
                  <select
                    className="status-select"
                    value={statuses[game.id] || 'PLAYING'}
                    onChange={(e) => handleStatusChange(game.id, e.target.value)}
                  >
                    <option value="PLAYING">Playing</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button className="remove-button" onClick={() => handleRemove(game.id)}>
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

export default Playlist;
