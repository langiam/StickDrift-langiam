import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import type { Context } from './schemas/context.js';
import { fileURLToPath } from 'node:url';
import cors from 'cors';

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// Set __dirname manually for ESM compatibility
let __dirname: string | undefined = (globalThis as any).__dirname;
if (process.env.NODE_ENV === 'production' && !__dirname) {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
  (globalThis as any).__dirname = __dirname;
}

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = parseInt(process.env.PORT || "0") || 3001;
  const app = express();

  // CORS
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://stickdrift.onrender.com'
      : 'http://localhost:5173',
    credentials: true,
  }));

  // Body parsers
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apollo middleware
  app.use('/graphql', expressMiddleware<Context>(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      return authenticateToken(token);
    }
  }));

  // Static build serving (production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname!, '../../client/dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname!, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API server running on port ${PORT}`);
    console.log(`🔗 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
