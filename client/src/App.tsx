// client/src/App.tsx

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import SearchPage from './pages/Search';
// …other imports as needed…

function App() {
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async (term: string) => {
    setLoadingSearch(true);
    try {
      // Replace this with your actual GraphQL or REST query:
      // const { data } = await someSearchQuery({ variables: { searchTerm: term } });
      // setSearchResults(data.searchProfile.map((p: any) => ({ id: p._id, name: p.name })));
      // For now, simulate:
      setTimeout(() => {
        setSearchResults([
          { id: '1', name: `${term} Result 1` },
          { id: '2', name: `${term} Result 2` },
        ]);
        setLoadingSearch(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setLoadingSearch(false);
    }
  };

  const handleSelect = (profileId: string) => {
    // For example, navigate to that profile page:
    // navigate(`/profile/${profileId}`);
    console.log('Selected profile ID:', profileId);
  };

  return (
    <Router>
      <div className="App">
        <SearchBar
          onSearch={handleSearch}
          loading={loadingSearch}
          results={searchResults}
          onSelect={handleSelect}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          {/* …other routes… */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
