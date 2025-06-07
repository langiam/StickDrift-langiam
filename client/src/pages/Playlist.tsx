import React, { useEffect, useState } from 'react';
import '../styles/Playlist.css';

interface Game {
  id: number;
  name: string;
  rating: number;
  genres?: { name: string }[];
}

const Playlist: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
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

  return (
    <main className="page-wrapper">
      <div className="playlist-container">
        <h1 className="playlist-title">Game Playlist</h1>
        <ul className="playlist-items">
          {games.map((game) => (
            <li key={game.id} className="playlist-item">
              <div className="song-info">
                <div className="song-title">{game.name}</div>
                <div className="song-artist">
                  {game.genres?.map((genre) => genre.name).join(', ') || 'Unknown Genre'}
                </div>
              </div>
              <button className="play-button">Play ▶</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Playlist;
