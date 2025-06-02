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

  // 2. Create ApolloServer, pass context via authenticateToken
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => {
      const user = authenticateToken(req);
      return { user };
    },
  });
  await server.start();

  // 3. Mount middleware
  app.use(cors());
  app.use(bodyParser.json());

  // 4. Serve React build in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  }

  // 5. Use `any` to avoid the `express.Application` mismatch
  server.applyMiddleware({
    app: app as any,
    path: '/graphql',
  });

  // 6. Fallback for React routing in production
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
    });
  }

  // 7. Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch((err) => {
  console.error('Error starting server:', err);
});
