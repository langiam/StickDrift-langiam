import React, { useState, ChangeEvent, FormEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  loading?: boolean;
  results?: Array<{ id: string; name: string }>;
  onSelect?: (id: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading = false,
  results = [],
  onSelect,
}) => {
  const [term, setTerm] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    if (e.target.value.length >= 2) {
      onSearch(e.target.value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (term.length >= 2) {
      onSearch(term);
    }
  };

  return (
    <form className="searchbar-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search profiles..."
        value={term}
        onChange={handleChange}
        className="search-input"
      />
      {loading && <div className="search-loading">Searching…</div>}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((item) => (
            <li key={item.id} className="search-result-item">
              <span>{item.name}</span>
              {onSelect && (
                <button
                  className="search-result-btn"
                  onClick={() => onSelect(item.id)}
                >
                  View
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;

