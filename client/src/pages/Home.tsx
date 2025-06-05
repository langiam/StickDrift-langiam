import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import '..//styles/Home.css'; // Import your styles for the Home component

function Home() {
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);

    // Placeholder results
    setResults([
      `User result for "${searchTerm}"`,
      `Another result related to "${searchTerm}"`,
    ]);
  };

  return (
    <main className="home-container">
      <div className="home-content">
        <h1>StickDrift</h1>
        <p>Search GitHub users and view their profiles</p>

        <SearchBar onSearch={handleSearch} />

        {results.length > 0 && (
          <div className="search-results">
            <h2>Search Results</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
