"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const apollo_server_express_1 = require("apollo-server-express");
const connection_1 = __importDefault(require("./config/connection"));
const schemas_1 = require("./schemas");
const auth_1 = require("./utils/auth");
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
// Explicitly type as `Application` from the same `express` package
const app = (0, express_1.default)();
async function startApolloServer() {
    // 1. Connect to MongoDB
    await (0, connection_1.default)();
    console.log('✅ Database connected');
    // 2. Create ApolloServer, pass context via authenticateToken
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: schemas_1.typeDefs,
        resolvers: schemas_1.resolvers,
        context: ({ req }) => {
            const user = (0, auth_1.authenticateToken)(req);
            return { user };
        },
    });
    await server.start();
    // 3. Mount middleware
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    // 4. Serve React build in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client/dist')));
    }
    // 5. Use `any` to avoid the `express.Application` mismatch
    server.applyMiddleware({
        app: app,
        path: '/graphql',
    });
    // 6. Fallback for React routing in production
    if (process.env.NODE_ENV === 'production') {
        app.get('*', (_req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, '../client/dist/index.html'));
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
