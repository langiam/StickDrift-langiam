// server/src/server.ts

import express, { Application, Request } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authenticateToken } from './utils/auth';

dotenv.config();

// Use port 3001 (or from .env), but NOT 4000
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Create an Express application (typed as Application)
const app: Application = express();

async function startApolloServer() {
  // 1. Connect to MongoDB
  await db();
  console.log('✅ Database connected');

  // 2. Create ApolloServer passing `user` via context()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => {
      // Your JWT auth function should read Authorization header from req
      const user = authenticateToken(req);
      return { user };
    },
  });
  await server.start();

  // 3. CORS: allow only http://localhost:5173 (your Vite front end)
  //    This must appear BEFORE anything that handles /graphql.
  //    It will handle BOTH OPTIONS (preflight) and actual POST requests.
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['POST', 'OPTIONS'], // Apollo only needs POST & OPTIONS here
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 4. Body parsing (for any non‐GraphQL JSON endpoints you may add later)
  app.use(bodyParser.json());

  // 5. If you ever build & deploy the React client, serve it here:
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  }

  // 6. Mount ApolloServer on /graphql
  //    (We do NOT supply a separate `cors` option here, because Express is already handling it above.)
  server.applyMiddleware({
    app: app as any,
    path: '/graphql',
  });

  // 7. In production, serve index.html for any other GET
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
  }

  // 8. Start listening
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch((err) => {
  console.error('Error starting server:', err);
});
