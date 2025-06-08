// client/src/components/SearchBar/index.tsx
import React, { useState } from 'react';
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PROFILE } from "../../utils/queries";
import { useNavigate } from "react-router-dom";
import '../styles/SearchResults.css';
; // Ensure this path matches where you saved SearchBar.css

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchProfile, { loading, data, error }] = useLazyQuery(SEARCH_PROFILE);
  const [dropDown, setDropDown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      searchProfile({ variables: { name: searchQuery } });
      setDropDown(true);
    }
  };

  const handleProfileClick = (profileId: string) => {
    navigate(`/profiles/${profileId}`);
    setSearchQuery('');
    setDropDown(false);
  };

  return (
    <div className='searchbar-container'>
      <form onSubmit={handleSearch} autoComplete="off" className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search profiles..."
          onFocus={() => data && setDropDown(true)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {dropDown && data?.searchProfile?.length > 0 && (
        <ul className="search-dropdown">
          {data.searchProfile.map((profile: { _id: string; name: string }) => (
            <li
              key={profile._id}
              className="search-result"
              onClick={() => handleProfileClick(profile._id)}
            >
              {profile.name}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="search-message">Loading...</p>}
      {error && <p className="search-message">Error: {error.message}</p>}
      {dropDown && data?.searchProfile?.length === 0 && (
        <p className="search-message">No profiles found.</p>
      )}
    </div>
  );
};

export default SearchBar;
