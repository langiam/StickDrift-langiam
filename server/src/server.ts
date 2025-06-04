import express from 'express';
import cors from 'cors';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';

interface Context {
  user: any | null;
 } // Adjust the type as needed

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3000;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // app.use('/graphql', expressMiddleware(server as any,
  //   {
  //     context: authenticateToken as any
  //   }
  // ));

  app.use(cors());
  app.use(express.json());

  app.use(
  '/graphql',
  expressMiddleware<Context>(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1];;
      const user = token ? authenticateToken(token) : null;
      console.log('Context user:', user); // Log the user for debugging
      return { user }; // This is now passed to all resolvers
    }
  })
);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
