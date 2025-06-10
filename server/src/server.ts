// server/src/server.ts
import express from 'express';
import { ExpressContextFunctionArgument } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import rawgRoutes from './routes/rawg.js';

dotenv.config();
// Define __dirname for ES modules only if in production and not already set
let __dirname: string | undefined = (globalThis as any).__dirname;
if (process.env.NODE_ENV === 'production' && !__dirname) {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
  (globalThis as any).__dirname = __dirname;
}
async function startApolloServer() {
  await db();
  console.log('✅ Database connected');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();
  const PORT = Number(process.env.PORT ?? 3001);

  // Basic health route for uptime check
  // app.get('/', (_req, res) => {
  //   res.send('🚀 StickDrift API is running');
  // });
 if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname!, '../../client/dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname!, '../../client/dist/index.html'));
    });
  }

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
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
