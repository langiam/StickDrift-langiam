// client/src/components/UnifiedSearchBar.tsx
import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { SEARCH_PROFILE } from '../utils/queries';
import '../styles/SearchBar.css'; // ✅ correct path


const UnifiedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'users' | 'games'>('users');
  const [dropDown, setDropDown] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [searchProfile, { loading, data, error }] = useLazyQuery(SEARCH_PROFILE);

  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (mode === 'users') {
      console.log('Searching for users:', query);
      searchProfile({ variables: { name: query.trim() } });
      setDropDown(true);
    } else {
      fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(json => {
          setGameResults(json.results || []);
          setDropDown(true);
        })
        .catch(err => {
          console.error('Game search error:', err);
          setGameResults([]);
        });
    }
  };

  const handleClick = (id: string) => {
    if (mode === 'users') {
      navigate(`/profiles/${id}`);
    } else {
      navigate(`/game/${id}`);
    }
    setQuery('');
    setDropDown(false);
  };

  const results = mode === 'users' ? data?.searchProfile || [] : gameResults;

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSearch} className="search-form" autoComplete="off">
        <input
          type="text"
          value={query}
          placeholder={`Search ${mode === 'users' ? 'profiles' : 'games'}...`}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setDropDown(true)}
          className="search-input"
        />
        <select value={mode} onChange={(e) => setMode(e.target.value as 'users' | 'games')} className="search-select">
          <option value="users">Users</option>
          <option value="games">Games</option>
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>

      {dropDown && (
        <ul className="search-dropdown">
          {loading ? (
            <li className="search-message">Loading...</li>
          ) : results.length > 0 ? (
            results.map((result: any) => (
              <li key={result._id || result.id} onClick={() => handleClick(result._id || result.id)} className="search-result">
                {result.name}
              </li>
            ))
          ) : (
            <li className="search-message">No results found.</li>
          )}
        </ul>
      )}

      {error && <p className="search-message">Error: {error.message}</p>}
    </div>
  );
};

export default UnifiedSearchBar;
