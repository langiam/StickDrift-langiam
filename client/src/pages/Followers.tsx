import { useMutation, useQuery } from '@apollo/client';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import { Link } from 'react-router-dom';
import './Followers.css';

interface Profile {
  _id: string;
  name: string;
}

export default function Followers() {
  const { loading, data, error, refetch } = useQuery(QUERY_ME);
  const [followProfile] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

  const profiles: Profile[] = data?.me?.followers || [];
  const profilesFollowing: Profile[] = data?.me?.following || [];

  const handleFollow = async (profileId: string) => {
    try {
      await followProfile({ variables: { profileId } });
      refetch();
    } catch (error) {
      console.error('Error following profile:', error);
    }
  };

  const handleUnfollow = async (profileId: string) => {
    try {
      await unfollowProfile({ variables: { profileId } });
      refetch();
    } catch (error) {
      console.error('Error unfollowing profile:', error);
    }
  };

  if (loading) return <p className="followers-message">Loading...</p>;
  if (error) return <p className="followers-message">Error: {error.message}</p>;

  return (
    <main className="followers-page">
      <h1 className="followers-title">Followers</h1>
      <ul className="followers-list">
        {profiles.map((profile) => (
          <li key={profile._id} className="followers-item">
            <Link to={`/profiles/${profile._id}`} className="profile-link">
              {profile.name}
            </Link>
            <button className="neon-button" onClick={() => handleFollow(profile._id)}>Follow</button>
            <button className="neon-button" onClick={() => handleUnfollow(profile._id)}>Unfollow</button>
          </li>
        ))}
      </ul>

      <h1 className="followers-title">Following</h1>
      <ul className="followers-list">
        {profilesFollowing.map((profile) => (
          <li key={profile._id} className="followers-item">
            <Link to={`/profiles/${profile._id}`} className="profile-link">
              {profile.name}
            </Link>
            <button className="neon-button" onClick={() => handleFollow(profile._id)}>Follow</button>
            <button className="neon-button" onClick={() => handleUnfollow(profile._id)}>Unfollow</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
