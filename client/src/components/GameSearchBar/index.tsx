import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSearchBar.css';

const GameSearchBar = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const query = input.trim();
  if (query) {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  }
};
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(e);
    };
  return (
    <form onSubmit={handleSubmit} className="game-search-form">
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
