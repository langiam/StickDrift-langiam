import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSearchBar.css';

const BASE_URL =
  import.meta.env.MODE === 'production'
    ? 'https://your-render-backend.onrender.com'
    : '';

const GameSearchBar = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    try {
      const res = await fetch(`${BASE_URL}/api/rawg/games?search=${encodeURIComponent(query)}&page_size=10`);
      const data = await res.json();

      // Option 1: Navigate and pass search results via router state (if using a results page)
      navigate(`/search?query=${encodeURIComponent(query)}`, {
        state: { results: data.results },
      });

      // Option 2 (Alternative): Display results inline if you build a dropdown later
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="game-search-form">
      <input
        type="text"
        name="query"
        className="game-search-input"
        placeholder="Search games..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="game-search-button">
        Search
      </button>
    </form>
  );
};

export default GameSearchBar;
