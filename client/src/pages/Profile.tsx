// client/src/pages/Profile.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_SINGLE_PROFILE, QUERY_ME } from '../utils/queries';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import _AuthService from '../utils/auth';
import '../styles/Profile.css'; 

const ProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { data: meData } = useQuery(QUERY_ME);
  const { loading, data, error } = useQuery(QUERY_SINGLE_PROFILE, {
    variables: { profileId },
  });

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
  if (error) return <p>Error loading profile.</p>;

  const profile = data.profile;
  const me = meData?.me;
  const isSelf = me?._id === profile._id;
  const isFollowing = me?.following.some((f: any) => f._id === profile._id);

  return (
    <div className="profile-container">
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Followers: {profile.followers.length}</p>
      <p>Following: {profile.following.length}</p>

      {!isSelf && (
        <>
          {isFollowing ? (
            <button onClick={() => unfollowProfile()}>Unfollow</button>
          ) : (
            <button onClick={() => followProfile()}>Follow</button>
          )}
        </>
      )}

      <hr />

      <h3>Follower List:</h3>
      <ul>
        {profile.followers.map((f: any) => (
          <li key={f._id}>{f.name}</li>
        ))}
      </ul>

      <h3>Following List:</h3>
      <ul>
        {profile.following.map((f: any) => (
          <li key={f._id}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
