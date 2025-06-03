// client/src/pages/Home.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_PROFILES } from '../utils/queries';
import _AuthService from '../utils/auth';
import '../styles/home.css'; // <-- make sure this path matches where your home.css lives

const Home: React.FC = () => {
  const { data: meData } = useQuery(QUERY_ME);
  const {
    loading: profilesLoading,
    data: profilesData,
    error: profilesError,
  } = useQuery(QUERY_PROFILES);

  if (profilesLoading) return <p>Loading profiles…</p>;
  if (profilesError) return <p>Error loading profiles.</p>;

  const me = meData?.me;
  const allProfiles = profilesData?.profiles || [];

  return (
    <main>
      <div>
        <div>
          <h2>Welcome{me ? `, ${me.name}` : ''}!</h2>
          <p>All Profiles:</p>
        </div>
        <div>
          <ul>
            {allProfiles.map((profile: any) => (
              <li key={profile._id}>
                <a href={`/profile/${profile._id}`}>{profile.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Home;
