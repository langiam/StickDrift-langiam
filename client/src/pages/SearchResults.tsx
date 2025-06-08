import { useLocation } from 'react-router-dom';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <main className="page-wrapper">
      <div className="search-results-container">
        <h1 className="results-title">Search Results</h1>
        {results.length === 0 ? (
          <p className="results-message">No games found.</p>
        ) : (
          <ul className="results-list">
            {results.map((game: any) => (
              <li key={game.id} className="result-item">
                <a href={`/game/${game.id}`} className="result-link">
                  {game.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default SearchResults;
