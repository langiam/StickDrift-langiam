import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { QUERY_PROFILES } from '../utils/queries';

import '../styles/Home.css';

const Home = () => {
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];

  const [games, setGames] = useState([]);
  const apiKey = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}`);
        const data = await res.json();
        setGames(data.results || []);
      } catch (err) {
        console.error('Error fetching games:', err);
      }
    };

    fetchGames();
  }, [apiKey]);

  return (
    <main>
      <div>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <h3>There are {profiles.length} users.</h3>
          )}
        </div>

        {/* Add Sign Up button */}
        <div style={{ marginTop: '1rem' }}>
          <Link to="/signup">
            <button className="neon-button">Create an Account</button>
          </Link>
        </div>

        <div className="games-section">
          <h3>Top Games</h3>
          {games.length === 0 ? (
            <p>Loading games...</p>
          ) : (
            <ul>
              {games.slice(0, 5).map((game: any) => (
                <li key={game.id}>{game.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
