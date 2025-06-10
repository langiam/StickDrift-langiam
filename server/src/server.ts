// server/src/server.ts
import express from 'express';
import { ExpressContextFunctionArgument } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import rawgRoutes from './routes/rawg.js';

dotenv.config();

async function startApolloServer() {
  try {
    await db();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1); // Exit if DB fails
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();
  const PORT = Number(process.env.PORT ?? 3001);

  // Basic health route for uptime check
  app.get('/', (_req, res) => {
    res.send('🚀 StickDrift API is running');
  });

  // Apollo GraphQL middleware with CORS and JSON parsing
const graphqlMiddleware = expressMiddleware(server, {
  context: async ({ req }: ExpressContextFunctionArgument) => ({
    user: await authenticateToken(req.headers.authorization || ''),
  }),
}) as any;

app.use('/graphql', cors(), bodyParser.json(), graphqlMiddleware);

  

  // RAWG API proxy route
  app.use('/api/rawg', rawgRoutes);

 app.listen(PORT, () => {
  console.log(`✅ Listening on port ${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
});

}

startApolloServer();
