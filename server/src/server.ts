import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import type { RequestHandler } from 'express';
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
  await db();

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  app.use(cookieParser());

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(bodyParser.json());

  // ✅ Fix for TypeScript overload issue
  const graphqlMiddleware = expressMiddleware(server, {
  context: async ({ req, res }) => {
    const token = req.headers.authorization || req.cookies?.token || '';
    const user = authenticateToken(token);
    return { req, res, user };
  },
}) as unknown as RequestHandler;

app.use('/graphql', graphqlMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from the React app
app.use('/graphql', graphqlMiddleware);
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  const PORT = parseInt(process.env.PORT || '3001', 10);
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
