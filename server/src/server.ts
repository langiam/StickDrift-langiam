// server/src/server.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authenticateToken, ContextUser } from './utils/auth';

dotenv.config();

interface Context {
  req: any;
  res: any;
  user: ContextUser | null;
}

async function startApolloServer() {
  // 1) Connect to MongoDB
  await db();
  console.log('✅ Database connected');

  // 2) Create Apollo Server
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    // context is set later inside expressMiddleware
  });
  await server.start();

  // 3) Set up Express
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(bodyParser.json());

  // 4) Mount Apollo middleware (disable built-in CORS)
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const authHeader = req.headers.authorization || '';
        const cookieToken = req.cookies?.token;
        const tokenToVerify = authHeader || cookieToken || '';
        const user = authenticateToken(tokenToVerify);
        return { req, res, user };
      },
    })
  );

  // 5) Serve React build in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // 6) Start server
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
