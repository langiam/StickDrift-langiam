// server/src/server.ts
import express, { RequestHandler } from 'express';
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

import rawgRoutes from './routes/rawg';

dotenv.config();

interface Context {
  req: any;
  res: any;
  user: ContextUser | null;
}

async function startApolloServer() {
  await db();
  console.log('✅ Connected to MongoDB');

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();
  console.log('🚀 Apollo Server started');

  const app = express();

  // ✅ Order matters: cookie parser first
  app.use(cookieParser());

  // ✅ Enable CORS
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ✅ Parse JSON
  app.use(bodyParser.json());

  // ✅ Apollo middleware with proper TS fix
  const graphqlMiddleware = expressMiddleware(server, {
    context: async ({ req, res }) => {
      const token = req.headers.authorization || req.cookies?.token || '';
      const user = authenticateToken(token);
      return { req, res, user };
    },
  }) as unknown as RequestHandler;

  app.use('/graphql', graphqlMiddleware);

 app.use('/api/rawg', rawgRoutes);

  // ✅ Serve frontend in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  const PORT = parseInt(process.env.PORT || '3001', 10);
  app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
  });
}

startApolloServer();
