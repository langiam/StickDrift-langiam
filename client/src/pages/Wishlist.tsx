import React, { useEffect, useState } from 'react';
import '../styles/Wishlist.css';

interface Game {
  id: number;
  name: string;
  released: string;
  platforms?: { platform: { name: string } }[];
}

const Wishlist: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&dates=2025-06-07,2026-01-01&ordering=-added&page_size=10`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching wishlist games:', err);
      }
    };

    fetchWishlist();
  }, [apiKey]);

  return (
    <main className="page-wrapper">
      <div className="wishlist-container">
        <h1 className="wishlist-title">My Wishlist</h1>
        <div className="wishlist-description">
          These are the most anticipated upcoming games:
        </div>

        <ul className="wishlist-items">
          {games.map((game) => (
            <li key={game.id} className="wishlist-item">
              <span className="game-title">{game.name}</span>
              <span className="game-platform">
                {game.platforms?.map((p) => p.platform.name).join(', ') || 'TBA'}
              </span>
              <span className="game-release">{game.released}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Wishlist;
