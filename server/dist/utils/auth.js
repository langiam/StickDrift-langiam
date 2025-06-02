"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.signToken = void 0;
// server/src/utils/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'dev-secret';
// Generate a JWT signed token for a user
const signToken = (name, email, _id) => {
    const payload = { name, email, _id };
    return jsonwebtoken_1.default.sign({ data: payload }, JWT_SECRET, { expiresIn: '2h' });
};
exports.signToken = signToken;
const authenticateToken = (req) => {
    const authHeader = req.headers.authorization || '';
    // Expect header: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return null;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Payload is under .data
        return decoded.data;
    }
    catch (err) {
        throw new apollo_server_express_1.AuthenticationError('Invalid/Expired token');
    }
};
exports.authenticateToken = authenticateToken;
