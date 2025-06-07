import React, { useEffect, useState } from 'react';
import '../styles/GameCollections.css';

interface Game {
  id: number;
  name: string;
  released: string;
  platforms?: { platform: { name: string } }[];
}

const GameCollections: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    };

    fetchGames();
  }, [apiKey]);

  return (
    <main className="page-wrapper">
      <div className="gamecollections-container">
        <h1 className="gamecollections-title">Game Collections</h1>
        <div className="gamecollections-description">
          Browse top-rated games from RAWG:
        </div>

        <ul className="gamecollections-list">
          {games.map((game) => (
            <li key={game.id} className="gamecollections-item">
              <span className="game-title">{game.name}</span>
              <span className="game-platform">
                {game.platforms?.map((p) => p.platform.name).join(', ') || 'Unknown'}
              </span>
              <span className="game-date">{game.released}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default GameCollections;
