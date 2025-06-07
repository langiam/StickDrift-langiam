import { useEffect, useState } from 'react';
import { Navigate, useParams, Outlet, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import '../styles/Profile.css';
import Auth from '../utils/auth';

interface Profile {
  _id: string;
  name: string;
  followers: { _id: string }[];
  following: { _id: string }[];
}

const Profile = () => {
  const { profileId } = useParams();
  const { loading, data, refetch } = useQuery(
    profileId ? QUERY_SINGLE_PROFILE : QUERY_ME,
    { variables: { profileId } }
  );

  const [isMutating, setIsMutating] = useState(false);
  const [justFollowed, setjustFollowed] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const profile = data?.me || data?.profile || {};
  const currentProfileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

  const [followProfile] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

  const viewingOwnProfile = profile._id === currentProfileId;
  const actualFollowing = !viewingOwnProfile
    ? profile?.followers?.some((f: { _id: string }) => f._id === currentProfileId)
    : false;
  const isFollowing = justFollowed !== null ? justFollowed : actualFollowing;

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&page_size=5`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching suggested games:', err);
      }
    };

    fetchSuggestions();
  }, [apiKey]);

  const handleFollow = async () => {
    setIsMutating(true);
    try {
      await followProfile({ variables: { profileId: profile._id } });
      setjustFollowed(true);
      await refetch();
    } catch (error) {
      console.error('Error following profile:', error);
    }
    setIsMutating(false);
  };

  const handleUnfollow = async () => {
    setIsMutating(true);
    try {
      await unfollowProfile({ variables: { profileId: profile._id } });
      setjustFollowed(false);
      await refetch();
    } catch (error) {
      console.error('Error unfollowing profile:', error);
    }
    setIsMutating(false);
  };

  if (Auth.loggedIn() && currentProfileId === profileId) {
    return <Navigate to="/me" />;
  }

  if (loading) return <div className="glow-text">Loading...</div>;

  if (!profile?.name) {
    return (
      <h4 className="glow-text">
        You need to be logged in to see your profile page. Use the navigation
        links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div className="profile-container">
      {!viewingOwnProfile && currentProfileId && (
        isFollowing ? (
          <button className="neon-button" onClick={handleUnfollow} disabled={isMutating}>
            {isMutating ? 'Processing...' : 'Unfollow'}
          </button>
        ) : (
          <button className="neon-button" onClick={handleFollow} disabled={isMutating}>
            {isMutating ? 'Processing...' : 'Follow'}
          </button>
        )
      )}

      <div className="menu-button relative inline-block text-left mt-4">
        <button className="neon-button" onClick={() => setIsOpen(!isOpen)}>
          Menu ▾
        </button>
        {isOpen && (
          <div className="menu-items absolute mt-2 left-0 rounded-md shadow-lg bg-black border border-pink-500 z-50 px-2 py-2">
            <div className="flex flex-row gap-2">
              <Link to="wishlist" onClick={() => setIsOpen(false)} className="neon-button">Wishlist</Link>
              <Link to="calendar" onClick={() => setIsOpen(false)} className="neon-button">Calendar</Link>
              <Link to="library" onClick={() => setIsOpen(false)} className="neon-button">Library</Link>
              <Link to="followers" onClick={() => setIsOpen(false)} className="neon-button">Followers</Link>
              <Link to="gamecollection" onClick={() => setIsOpen(false)} className="neon-button">Collection</Link>
              <Link to="playlist" onClick={() => setIsOpen(false)} className="neon-button">Playlist</Link>
            </div>
          </div>
        )}
      </div>

      <h2 className="profile">{profile?.name}</h2>
      <Outlet />

      <div className="profile-suggestions mt-8">
        <h3 className="neon-subtitle">Suggested Games</h3>
        {games.length === 0 ? (
          <p className="glow-text">Loading game suggestions…</p>
        ) : (
          <ul className="suggestion-list">
            {games.map((game) => (
              <li key={game.id}>
                <Link to={`/game/${game.id}`} className="game-link">{game.name}</Link>{' '}
                {game.released && `(${game.released})`}
                {viewingOwnProfile && (
                  <button
                    className="add-button"
                    onClick={async () => {
                      try {
                        await fetch('/graphql', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('id_token')}`,
                          },
                          body: JSON.stringify({
                            query: `
                              mutation AddToLibrary($gameId: ID!, $gameName: String!) {
                                addToLibrary(gameId: $gameId, gameName: $gameName) {
                                  _id
                                  library {
                                    rawgId
                                    name
                                  }
                                }
                              }
                            `,
                            variables: {
                              gameId: game.id,
                              gameName: game.name,
                            },
                          }),
                        });
                        alert(`${game.name} added to your library!`);
                      } catch (err) {
                        console.error('Failed to add game to library:', err);
                      }
                    }}
                  >
                    ➕ Add
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
