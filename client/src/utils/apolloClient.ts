// client/src/utils/apolloClient.ts

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Always point directly at the backend, even in dev:
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  credentials: 'include', // if you’re using cookies for auth
});

// If you store a JWT in localStorage, attach it here. Otherwise you can remove this.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
