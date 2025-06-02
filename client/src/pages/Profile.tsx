import { Navigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import'./Home.css';
import Auth from '../utils/auth';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

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
    {
      variables: { profileId: profileId },
    }
  );

  const [isMutating, setIsMutating] = useState(false);
  const [justFollowed, setjustFollowed] = useState<boolean | null>(null);

  const profile = data?.me || data?.profile || {};
  
  const currentProfileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

  const [followProfile] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

  if (Auth.loggedIn() && currentProfileId === profileId) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div className="glow-text">Loading...</div>;
  }

  if (!profile?.name) {
    return (
      <h4 className="glow-text">
        You need to be logged in to see your profile page. Use the navigation
        links above to sign up or log in!
      </h4>
    );
  }

  const handleFollow = async () => {
    setIsMutating(true);
    try {
      await followProfile({
        variables: { profileId: profile._id },
      });
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
      await unfollowProfile({
        variables: { profileId: profile._id },
      });
      setjustFollowed(false);
      await refetch();
    } catch (error) {
      console.error('Error unfollowing profile:', error);
    }
    setIsMutating(false);
  };

  const viewingOwnProfile = profile._id === currentProfileId;

  const actualFollowing = !viewingOwnProfile
    ? profile?.followers?.some((f: { _id: string }) => f._id === currentProfileId)
    : false;

  const isFollowing = justFollowed !== null ? justFollowed : actualFollowing;

  console.log('isFollowing:', isFollowing);
  console.log(profile.following);
  console.log('Current Profile ID:', currentProfileId);
  console.log('Profile ID:', profile._id);

  return (
    <div className="profile-container">
      <h2 className="neon-heading">{profile?.name}</h2>
      {currentProfileId && profile._id !== currentProfileId && (
        isFollowing ? (
          <button className="neon-button" onClick={handleUnfollow} disabled={isMutating}>
          {isMutating ? "Processing..." : "Unfollow"}</button>
          ) : (
          <button className="neon-button" onClick={handleFollow} disabled={isMutating}>
          {isMutating ? "Processing..." : "Follow"}
          </button>
          )
        )
    }
      <div className="profile-buttons">
        <Link to={"wishlist"}><button className="neon-button">Wishlist</button></Link>
        <Link to={"calendar"}><button className="neon-button">Release Calendar</button></Link>
        <Link to={"library"}><button className="neon-button">Library</button></Link>
        <Link to={"followers"}><button className="neon-button">Followers List</button></Link>
        <Link to={"gamecollection"}><button className="neon-button">Game Collection</button></Link>
        <Link to={"playlist"}><button className="neon-button">Playlist</button></Link>
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;
