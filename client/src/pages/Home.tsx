import { useQuery } from '@apollo/client';

import { QUERY_PROFILES } from '../utils/queries';

 import'./Home.css';
<<<<<<< HEAD

=======
//  import 'animate.css'
>>>>>>> 452af37a249079e474ce0d5df3560ce0bf313af9
const Home = () => {
  const { loading, data } = useQuery(QUERY_PROFILES);
  const profiles = data?.profiles || [];

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
      </div>
    </main>
  );
};

export default Home;
