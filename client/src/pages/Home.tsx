import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import '..//styles/Home.css'; // Import your styles for the Home component
// client/src/pages/Home.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PROFILES } from '../utils/queries';
import './Home.css';

const Home: React.FC = () => {
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];

  return (
    <main className="home-container">
      <div className="home-content">
        {loading ? (
          <div>Loading…</div>
        ) : (
          <h3>There are {profiles.length} users.</h3>
        )}
      </div>
    </main>
  );
};

export default Home;
