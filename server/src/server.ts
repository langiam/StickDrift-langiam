// server/src/server.ts
import express, { Request } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import rawgRoutes from './routes/rawg.js'; // ✅ uses your modular route file

dotenv.config();

async function startApolloServer() {
  await db();
  console.log('✅ Database connected');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();
  const PORT = parseInt(process.env.PORT || '3001', 10);

  // ✅ Allow CORS + JSON + Apollo GraphQL middleware
  app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        const token = req.headers.authorization || '';
        const user = authenticateToken(token);
        return { user };
      },
    })
  );

  // ✅ RAWG API Route Handler
  app.use('/api/rawg', rawgRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
