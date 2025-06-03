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

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Explicitly type as `Application` from the same `express` package
const app: Application = express();

async function startApolloServer() {
  // 1. Connect to MongoDB
  await db();
  console.log('✅ Database connected');

  // 2. Create ApolloServer, passing `user` from authenticateToken into context
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => {
      const user = authenticateToken(req);
      return { user };
    },
  });
  await server.start();

  // 3. Enable CORS – allow requests from our frontend origin
  //    In development, the frontend runs at http://localhost:5173
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );

  // 4. Parse JSON bodies for incoming requests
  app.use(bodyParser.json());

  // 5. If running in production, serve the React build output
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  }

  // 6. Mount Apollo server as middleware on `/graphql`
  //    Cast `app` to `any` to avoid the `express.Application` type mismatch
  server.applyMiddleware({
    app: app as any,
    path: '/graphql',
  });

  // 7. Fallback route: serve `index.html` for any unrecognized route (client‐side routing)
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
  }

  // 8. Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch((err) => {
  console.error('Error starting server:', err);
});
