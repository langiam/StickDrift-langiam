// import { useState } from 'react';
// import SearchBar from '../components/SearchBar';

import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_PROFILES } from '../utils/queries';
import '../styles/Home.css'; // Assuming you have a CSS file for styles
// import 'animate.css/animate.min.css';

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
