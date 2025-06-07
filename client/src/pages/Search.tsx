import { useState, useEffect } from 'react';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
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

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameResults, setGameResults] = useState([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  // 1) Fetch the current user (“me”)
  const { data: meData, loading: meLoading } = useQuery<QueryMeResult>(QUERY_ME);

  // 2) Lazy query to search other profiles
  const [searchProfiles, { data: searchData, loading: searchLoading }] =
    useLazyQuery<QuerySearchProfileResult>(SEARCH_PROFILE);

  // 3) Mutations to follow / unfollow (refetch QUERY_ME to update “following”)
  const [followProfile] = useMutation(FOLLOW_PROFILE, {
    refetchQueries: [{ query: QUERY_ME }],
  });
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  // Search profiles (GraphQL)
  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchProfiles({ variables: { searchTerm } });
    }
  }, [searchTerm, searchProfiles]);

  // Search games (RAWG)
  useEffect(() => {
    const searchGames = async () => {
      if (searchTerm.length < 2) {
        setGameResults([]);
        return;
      }

      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${searchTerm}`);
        const data = await res.json();
        setGameResults(data.results || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setGameResults([]);
      }
    };

    searchGames();
  }, [searchTerm, apiKey]);

  if (meLoading) {
    return <p>Loading user info…</p>;
  }

  const me = meData?.me;
  const profileResults = searchData?.searchProfile || [];

  return (
    <main className="page-wrapper">
      <div className="search-page-container">
        <h2>Search Profiles & Games</h2>
        <input
          type="text"
          placeholder="Type name, email, or game title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-page-input"
        />

        {/* Profile results */}
        <h3>Users</h3>
        {searchLoading && <p>Searching users…</p>}
        <ul className="search-page-results">
          {profileResults.map((profile) => {
            const isSelf = me?._id === profile._id;
            const isFollowing = me?.following.some((f) => f._id === profile._id) ?? false;

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
          {searchTerm.length >= 2 && profileResults.length === 0 && (
            <li>No matching users found</li>
          )}
        </ul>

        {/* Game results */}
        <h3>Games</h3>
        <ul className="search-page-results">
          {gameResults.map((game: any) => (
            <li key={game.id}>
              {game.name} {game.released ? `(${game.released})` : ''}
            </li>
          ))}
          {searchTerm.length >= 2 && gameResults.length === 0 && (
            <li>No matching games found</li>
          )}
        </ul>
      </div>
    </main>
  );
};

export default SearchPage;
