import { useEffect, useState } from 'react';
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
  const query = params.get('query') || '';
  const mode = (params.get('mode') as 'users' | 'games') || 'games';

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

  const profileResults = profileData?.searchProfile || [];

  return (
    <main className="page-wrapper">
      <div className="search-page-container">
        <h2>Search Results for “{query}” ({mode})</h2>

        {mode === 'users' && (
          <>
            <h3>Users</h3>
            {profileLoading && (
              <>
                <div className="skeleton-card shimmer" />
                <div className="skeleton-card shimmer" />
                <div className="skeleton-card shimmer" />
              </>
            )}
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
              {query.length >= 2 && profileResults.length === 0 && !profileLoading && (
                <li>No matching users found</li>
              )}
            </ul>
          </>
        )}

        {mode === 'games' && (
          <>
            <h3>Games</h3>
            {gameResults.length === 0 && query.length >= 2 && (
              <div className="game-grid">
                <div className="skeleton-card shimmer" style={{ height: '200px', width: '150px' }} />
                <div className="skeleton-card shimmer" style={{ height: '200px', width: '150px' }} />
                <div className="skeleton-card shimmer" style={{ height: '200px', width: '150px' }} />
              </div>
            )}
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
            </div>
            {query.length >= 2 && gameResults.length === 0 && (
              <p>No matching games found</p>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Search;
