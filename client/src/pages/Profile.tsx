import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import'./Home.css';
import Auth from '../utils/auth';

const Profile = () => {
  const { profileId } = useParams();

  const { loading, data } = useQuery(
    profileId ? QUERY_SINGLE_PROFILE : QUERY_ME,
    {
      variables: { profileId: profileId },
    }
  );

  const profile = data?.me || data?.profile || {};

  if (Auth.loggedIn() && Auth.getProfile().data._id === profileId) {
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

  return (
    <div className="profile-container">
      <h2 className="neon-heading">{profile?.name}</h2>
      <div className="profile-buttons">
        <Link to="/wishlist"><button className="neon-button">Wishlist</button></Link>
        <Link to="/calendar"><button className="neon-button">Release Calendar</button></Link>
        <Link to="/library"><button className="neon-button">Library</button></Link>
        <Link to="/followers"><button className="neon-button">Followers List</button></Link>
        <Link to="/gamecollection"><button className="neon-button">Game Collection</button></Link>
        <Link to="/playlist"><button className="neon-button">Playlist</button></Link>
      </div>
    </div>
  );
};

export default Profile;
