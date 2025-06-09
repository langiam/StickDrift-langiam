import { useLocation } from 'react-router-dom';
import '../styles/SearchResults.css';

interface Game {
  id: number;
  name: string;
  released?: string;
  background_image?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const SearchResults = () => {
  const location = useLocation();
  const results = location.state?.results || [];
  const mode = location.state?.mode || 'games';

  return (
    <main className="page-wrapper">
      <div className="search-results-container">
        <h1 className="results-title">Search Results for {mode === 'users' ? 'Users' : 'Games'}</h1>

        {results.length === 0 ? (
          <p className="results-message">No {mode} found.</p>
        ) : (
          <ul className="results-list">
            {results.map((item: Game | User) => (
              <li key={'id' in item ? item.id : item._id} className="result-item">
                {mode === 'games' ? (
                  <a href={`/game/${(item as Game).id}`} className="result-link">
                    {(item as Game).name}
                  </a>
                ) : (
                  <a href={`/profiles/${(item as User)._id}`} className="result-link">
                    {(item as User).name} ({(item as User).email})
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default SearchResults;
