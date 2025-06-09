import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import '../styles/Followers.css';

interface Profile {
  _id: string;
  name: string;
}

export default function Followers() {
  const { profileId } = useParams();
  const visitingAnotherProfile = !!profileId;

  const { loading, data, refetch } = useQuery(
    visitingAnotherProfile ? QUERY_SINGLE_PROFILE : QUERY_ME,
    {
      variables: profileId ? { profileId } : {},
    }
  );

  const [followProfile] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

  const profile = data?.profile || data?.me || {};
  const profiles: Profile[] = profile?.followers || [];
  const profilesFollowing: Profile[] = profile?.following || [];

  const currentProfileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

  const handleFollow = async (targetId: string) => {
    try {
      await followProfile({ variables: { profileId: targetId } });
      refetch();
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async (targetId: string) => {
    try {
      await unfollowProfile({ variables: { profileId: targetId } });
      refetch();
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  // RAWG trending games
  const [games, setGames] = useState<any[]>([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    refetch(); // ensure fresh data on mount
  }, [refetch]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-added&page_size=6`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('RAWG fetch error:', err);
      }
    };
    fetchGames();
  }, [apiKey]);

  if (loading) {
    return <div className="glow-text">Loading followers…</div>;
  }

  return (
    <main className="page-wrapper">
      <div className="followers-container">
        <h1 className="followers-title">Followers</h1>

        {profiles.length === 0 ? (
          <p className="glow-text">No followers yet.</p>
        ) : (
          <ul className="followers-list">
            {profiles.map((follower) => {
              const isFollowing = profilesFollowing.some((f) => f._id === follower._id);
              const isSelf = follower._id === currentProfileId;

              return (
                <li key={follower._id}>
                  {follower.name}{' '}
                  {!isSelf && (
                    <button
                      onClick={() =>
                        isFollowing
                          ? handleUnfollow(follower._id)
                          : handleFollow(follower._id)
                      }
                      className="neon-button"
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <h1 className="followers-title">Following</h1>

        {profiles.length === 0 ? (
          <p className="glow-text">Not following any profiles.</p>
        ) : (
          <ul className="followers-list">
            {profilesFollowing.map((following) => {
              const isFollowing = profilesFollowing.some((f) => f._id === following._id);
              const isSelf = following._id === currentProfileId;

              return (
                <li key={following._id}>
                  {following.name}{' '}
                  {!isSelf && (
                    <button
                      onClick={() =>
                        isFollowing
                          ? handleUnfollow(following._id)
                          : handleFollow(following._id)
                      }
                      className="neon-button"
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="followers-games mt-8">
          <h2 className="neon-subtitle">Trending Games</h2>
          {games.length === 0 ? (
            <p className="glow-text">Loading games…</p>
          ) : (
            <ul className="followers-game-list">
              {games.map((game) => (
                <li key={game.id}>
                  {game.name} {game.released ? `(${game.released})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
