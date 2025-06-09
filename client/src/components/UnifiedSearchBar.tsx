import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const UnifiedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'users' | 'games'>('users');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const encodedQuery = encodeURIComponent(trimmed);
    navigate(`/search?query=${encodedQuery}&mode=${mode}`);
  };

  return (
    <form onSubmit={handleSearch} className="unified-search-bar">
      <div className="search-mode-toggle">
        <button
          type="button"
          className={mode === 'users' ? 'active' : ''}
          onClick={() => setMode('users')}
        >
          Users
        </button>
        <button
          type="button"
          className={mode === 'games' ? 'active' : ''}
          onClick={() => setMode('games')}
        >
          Games
        </button>
      </div>

      <input
        type="text"
        placeholder={`Search ${mode}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <button type="submit" className="search-submit">
        🔍
      </button>
    </form>
  );
};

export default UnifiedSearchBar;
