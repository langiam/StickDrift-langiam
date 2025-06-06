// server/src/server.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import { ApolloServer } from 'apollo-server-express';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authenticateToken, ContextUser } from './utils/auth';

dotenv.config();

// Use `any` here so we don’t run into mismatched Express types
interface Context {
  req: any;
  res: any;
  user: ContextUser | null;
}

async function startApolloServer() {
  // 1) Connect to MongoDB
  await db();
  console.log('✅ Database connected');

  // 2) Create ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }): Context => {
      const authHeader = req.headers.authorization || '';
      const cookieToken = req.cookies?.token;
      const tokenToVerify = authHeader || cookieToken || '';
      const user = authenticateToken(tokenToVerify);
      return { req, res, user };
    },
  });
  await server.start();

  // 3) Set up Express
  const app = express();

  // Enable cookie parsing (if you use HttpOnly cookies)
  app.use(cookieParser());

  // Allow CORS from Vite dev server
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(bodyParser.json());

  // 4) Mount GraphQL middleware at /graphql (disable Apollo’s built-in CORS)
  server.applyMiddleware({ app: app as any, path: '/graphql', cors: false });

  // 5) In production, serve the React build
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  }

  // 6) Send index.html for all remaining routes (for React Router)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  // 7) Start listening
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startApolloServer();
