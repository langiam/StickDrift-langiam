import { useEffect, useState } from 'react';
import { Navigate, useParams, Outlet, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import {
  FOLLOW_PROFILE,
  UNFOLLOW_PROFILE,
  ADD_TO_LIBRARY,
  ADD_TO_WISHLIST,
  ADD_TO_PLAYLIST,
} from '../utils/mutations';
import '../styles/Profile.css';
import Auth from '../utils/auth';
import button from '../assets/menu-button.jpg';

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
  const [games, setGames] = useState<any[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  const profile = data?.me || data?.profile || {};
  const currentProfileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

  const [followProfile] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);
  const [addToLibrary] = useMutation(ADD_TO_LIBRARY);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [addToPlaylist] = useMutation(ADD_TO_PLAYLIST);

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

  const handleAdd = async (game: any, listType: 'library' | 'wishlist' | 'playlist') => {
    const input = {
      rawgId: game.id.toString(),
      name: game.name,
      released: game.released || '',
      background_image: game.background_image || '',
    };
    try {
      if (listType === 'library') {
        await addToLibrary({ variables: { gameInput: input } });
      } else if (listType === 'wishlist') {
        await addToWishlist({ variables: { gameInput: input } });
      } else if (listType === 'playlist') {
        await addToLibrary({ variables: { gameInput: input } });
        await addToPlaylist({ variables: { gameInput: input } });
      }
    } catch (err) {
      console.error(`Failed to add ${game.name} to ${listType}:`, err);
    }
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
        <button className="menu-button">
          <img src={button} alt="Menu Button" className="menu-img" />
        </button>
        <div className="menu-items absolute mt-2 left-0 rounded-md shadow-lg bg-black border border-pink-500 z-50 px-2 py-2">
          <div className="flex flex-row gap-2">
            <Link to="wishlist" className="neon-button">Wishlist</Link>
            <Link to="calendar" className="neon-button">Calendar</Link>
            <Link to="library" className="neon-button">Library</Link>
            <Link to="followers" className="neon-button">Followers</Link>
            <Link to="gamecollection" className="neon-button">Collection</Link>
            <Link to="playlist" className="neon-button">Playlist</Link>
          </div>
        </div>
      </div>

      <h2 className="profile">{profile?.name}</h2>
      <Outlet />

      {viewingOwnProfile && (
        <div className="profile-suggestions mt-8">
          <h3 className="neon-subtitle">Suggested Games</h3>
          {games.length === 0 ? (
            <p className="glow-text">Loading game suggestions…</p>
          ) : (
            <ul className="library-list">
              {games.map((game) => (
                <li key={game.id} className="library-item">
                  <span
                    className="library-game-title"
                    onClick={() => window.location.href = `/game/${game.id}`}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {game.name}
                  </span>
                  <span className="library-release">{game.released || 'Unknown Release Date'}</span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button className="action-button" onClick={() => handleAdd(game, 'library')} style={{ marginRight: '0.5rem' }}>
                      ➕ Library
                    </button>
                    <button className="action-button" onClick={() => handleAdd(game, 'wishlist')} style={{ marginRight: '0.5rem' }}>
                      💖 Wishlist
                    </button>
                    <button className="action-button" onClick={() => handleAdd(game, 'playlist')}>
                      🎮 Playlist
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
