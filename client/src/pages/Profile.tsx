import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import '../styles/Profile.css';

interface BasicProfile {
  _id: string;
  name: string;
}

interface ProfileDetail {
  _id: string;
  name: string;
  email: string;
  followers: BasicProfile[];
  following: BasicProfile[];
}

interface QuerySingleProfileResult {
  profile: ProfileDetail;
}

interface QueryMeResult {
  me: ProfileDetail;
}

const ProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();

  // Fetch the current user (“me”)
  const { data: meData } = useQuery<QueryMeResult>(QUERY_ME);

  // Fetch the profile being viewed
  const {
    loading,
    data: singleData,
    error,
  } = useQuery<QuerySingleProfileResult>(QUERY_SINGLE_PROFILE, {
    variables: { profileId },
  });

  // Follow / unfollow mutations
  const [followProfile] = useMutation(FOLLOW_PROFILE, {
    variables: { profileId },
    refetchQueries: [
      { query: QUERY_SINGLE_PROFILE, variables: { profileId } },
      { query: QUERY_ME },
    ],
  });
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE, {
    variables: { profileId },
    refetchQueries: [
      { query: QUERY_SINGLE_PROFILE, variables: { profileId } },
      { query: QUERY_ME },
    ],
  });

  if (loading) return <p>Loading profile…</p>;
  if (error || !singleData) return <p>Error loading profile.</p>;

  const profile = singleData.profile;
  const me = meData?.me;
  const isSelf = me?._id === profile._id;
  const isFollowing = me?.following.some((f) => f._id === profile._id) ?? false;

  return (
    <div className="profile-container">
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Followers: {profile.followers.length}</p>
      <p>Following: {profile.following.length}</p>

      {!isSelf && (
        <>
          {isFollowing ? (
            <button onClick={() => unfollowProfile()}>
              Unfollow
            </button>
          ) : (
            <button onClick={() => followProfile()}>Follow</button>
          )}
        </>
      )}

      <hr />

      <h3>Follower List:</h3>
      <ul>
        {profile.followers.map((f) => (
          <li key={f._id}>{f.name}</li>
        ))}
      </ul>

      <h3>Following List:</h3>
      <ul>
        {profile.following.map((f) => (
          <li key={f._id}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
