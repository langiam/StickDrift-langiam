import React, { useEffect, useState } from 'react';
import '../styles/Library.css';

interface Game {
  id: number;
  name: string;
  released: string;
  platforms?: { platform: { name: string } }[];
}

const Library: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&page_size=10`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching library games:', err);
      }
    };

    fetchLibrary();
  }, [apiKey]);

  return (
    <main className="page-wrapper">
      <div className="library-container">
        <h1 className="library-title">Library</h1>
        <div className="library-description">
          <p>Here are some of your games, powered by RAWG:</p>
        </div>

        <ul className="library-list">
          {games.map((game) => (
            <li key={game.id} className="library-item">
              <span className="library-game-title">{game.name}</span>
              <span className="library-platforms">
                {game.platforms?.map((p) => p.platform.name).join(', ') || 'Unknown'}
              </span>
              <span className="library-release">{game.released}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Library;
