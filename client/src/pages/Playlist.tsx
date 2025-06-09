import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Playlist.css';

interface Game {
  id: number;
  name: string;
  rating: number;
  genres?: { name: string }[];
  released?: string;
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
        <h1 className="playlist-title">Game Playlist</h1>
        <ul className="playlist-items">
          {games.map((game) => (
            <li key={game.id} className="playlist-item">
              <div className="song-info">
                <Link to={`/game/${game.id}`} className="playlist-game-title">
                  {game.name}
                </Link>
                <div className="song-artist">
                  {game.genres?.map((genre) => genre.name).join(', ') || 'Unknown Genre'}
                </div>
              </div>
              <div className="playlist-actions">
                <select
                  className="status-select"
                  value={statuses[game.id] || 'Want to Play'}
                  onChange={(e) => handleStatusChange(game.id, e.target.value)}
                >
                  <option>Want to Play</option>
                  <option>Playing</option>
                  <option>Completed</option>
                </select>
                <button className="remove-button" onClick={() => handleRemove(game.id)}>
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Playlist;
