import { useState, useEffect } from 'react';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEARCH_PROFILE, QUERY_ME } from '../utils/queries';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import '../styles/Search.css';

interface BasicProfile {
  _id: string;
  name: string;
  email: string;
}

interface QuerySearchProfileResult {
  searchProfile: BasicProfile[];
}

interface QueryMeResult {
  me: BasicProfile & { following: BasicProfile[] };
}

interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string;
}

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('query') || '';

  const [mode, setMode] = useState<'users' | 'games'>('games');
  const [query, setQuery] = useState(initialQuery);
  const [gameResults, setGameResults] = useState<Game[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const { data: meData } = useQuery<QueryMeResult>(QUERY_ME);
  const me = meData?.me;

  const [searchProfiles, { data: profileData, loading: profileLoading }] =
    useLazyQuery<QuerySearchProfileResult>(SEARCH_PROFILE);

  const [followProfile] = useMutation(FOLLOW_PROFILE, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  // Fetch results based on mode and query
  useEffect(() => {
    if (mode === 'users' && query.length >= 2) {
      searchProfiles({ variables: { searchTerm: query } });
    } else if (mode === 'games' && query.length >= 2) {
      const fetchGames = async () => {
        try {
          const res = await fetch(
            `https://api.rawg.io/api/games?key=${apiKey}&search=${query}`
          );
          const data = await res.json();
          setGameResults(data.results || []);
        } catch (err) {
          console.error('RAWG fetch error:', err);
          setGameResults([]);
        }
      };
      fetchGames();
    }
  }, [query, mode]);

  // Sync query to URL
  useEffect(() => {
    const encoded = encodeURIComponent(query.trim());
    if (encoded.length > 0) {
      navigate(`/search?query=${encoded}`, { replace: true });
    } else {
      navigate('/search', { replace: true });
    }
  }, [query]);

  const profileResults = profileData?.searchProfile || [];

  return (
    <main className="page-wrapper">
      <div className="search-page-container">
        <h2>Search</h2>
        <div className="search-toggle">
          <button
            className={mode === 'users' ? 'active' : ''}
            onClick={() => setMode('users')}
          >
            Users
          </button>
          <button
            className={mode === 'games' ? 'active' : ''}
            onClick={() => setMode('games')}
          >
            Games
          </button>
        </div>

        <input
          type="text"
          placeholder={`Search for ${mode === 'users' ? 'users' : 'games'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-page-input"
        />

        {mode === 'users' && (
          <>
            <h3>Users</h3>
            {profileLoading && <p>Loading users…</p>}
            <ul className="search-page-results">
              {profileResults.map((profile) => {
                const isSelf = me?._id === profile._id;
                const isFollowing =
                  me?.following.some((f) => f._id === profile._id) ?? false;

                return (
                  <li key={profile._id} className="search-page-result">
                    <span>
                      {profile.name} ({profile.email})
                    </span>
                    {!isSelf && (
                      <button
                        onClick={() =>
                          isFollowing
                            ? unfollowProfile({ variables: { profileId: profile._id } })
                            : followProfile({ variables: { profileId: profile._id } })
                        }
                        className={`search-page-btn ${isFollowing ? 'unfollow' : ''}`}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                  </li>
                );
              })}
              {query.length >= 2 && profileResults.length === 0 && (
                <li>No matching users found</li>
              )}
            </ul>
          </>
        )}

        {mode === 'games' && (
          <>
            <h3>Games</h3>
            <div className="game-grid">
              {gameResults.map((game) => (
                <div
                  key={game.id}
                  className="game-card"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <img src={game.background_image} alt={game.name} />
                  <h3>{game.name}</h3>
                  <p>{game.released}</p>
                </div>
              ))}
              {query.length >= 2 && gameResults.length === 0 && (
                <p>No matching games found</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Search;
