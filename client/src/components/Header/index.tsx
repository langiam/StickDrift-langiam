// client/src/components/Header/index.tsx

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import './Header.css'; // Ensure this path matches where you saved Header.css

const SEARCH_PROFILES = gql`
  query SearchProfile($searchTerm: String!) {
    searchProfile(searchTerm: $searchTerm) {
      _id
      name
    }
  }
`;

export default function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchProfiles, { data }] = useLazyQuery(SEARCH_PROFILES);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchProfiles({ variables: { searchTerm } });
    }
  };

  const profiles = data?.searchProfile || [];

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo / Title with glitch effect */}
        <Link to="/" className="logo">
          <div
            className="glitch-horizontal"
            data-text="StickDrift"
          >
            StickDrift
          </div>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" type="submit">
            Search
          </button>
          {profiles.length > 0 && (
            <ul className="search-dropdown">
              {profiles.map((p: { _id: string; name: string }) => (
                <li
                  key={p._id}
                  className="search-result"
                  onClick={() => navigate(`/profiles/${p._id}`)}
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
          {data && profiles.length === 0 && (
            <div className="search-message">No profiles found.</div>
          )}
        </form>

        {/* Navigation links */}
        <nav className="nav-links">
          <button onClick={() => navigate("/me")}>My Profile</button>
          <button
            onClick={() => {
              localStorage.removeItem("id_token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
