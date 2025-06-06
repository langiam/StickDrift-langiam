// client/src/components/SearchBar/index.tsx

import { useLazyQuery } from "@apollo/client";
import { SEARCH_PROFILE } from "../../utils/queries";
import { useNavigate } from "react-router-dom";
import './SearchBar.css'; // Ensure this path matches where you saved SearchBar.css

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchProfiles, { data }] = useLazyQuery(SEARCH_PROFILE);

  // Handler for form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("searchTerm") as HTMLInputElement;
    const term = input.value.trim();

    if (term) {
      searchProfiles({ variables: { searchTerm: term } });
    }
  };

  // Results array (could be empty)
  const profiles = data?.searchProfile || [];

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          name="searchTerm"
          className="search-input"
          type="text"
          placeholder="Search profiles..."
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

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
    </div>
  );
};

export default SearchBar;
