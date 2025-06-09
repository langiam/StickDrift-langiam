import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const SEARCH_PROFILES = gql`
  query SearchProfile($searchTerm: String!) {
    searchProfile(searchTerm: $searchTerm) {
      _id
      name
      email
    }
  }
`;

const UnifiedSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'games' | 'users'>('games');
  const navigate = useNavigate();

  const [searchProfiles] = useLazyQuery(SEARCH_PROFILES);

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  const trimmed = query.trim();
  if (!trimmed) return;

  if (mode === 'games') {
    try {
      const rawgRes = await fetch(
        `/api/rawg/games?search=${encodeURIComponent(trimmed)}&page_size=10`
      );

      if (!rawgRes.ok) {
        throw new Error(`RAWG API Error: ${rawgRes.status} ${rawgRes.statusText}`);
      }

      const contentType = rawgRes.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await rawgRes.text();
        throw new Error(`Invalid JSON from RAWG API: ${text}`);
      }

      navigate(`/search?search=${encodeURIComponent(trimmed)}&mode=games`);
    } catch (err) {
      console.error('Game search failed:', err);
    }
  } else {
    try {
      await searchProfiles({
        variables: { searchTerm: trimmed },
      });

      navigate(`/search?search=${encodeURIComponent(trimmed)}&mode=users`);
    } catch (err) {
      console.error('User search failed:', err);
    }
  }
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
