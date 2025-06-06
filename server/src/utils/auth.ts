// server/src/utils/auth.ts

import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your_jwt_secret_here';
const JWT_EXPIRES_IN = '2h'; // adjust as needed

export interface ContextUser {
  _id: string;
  name: string;
  email: string;
}

// 1) Sign a new JWT given a profile’s name, email, and Mongo _id
export function signToken(name: string, email: string, _id: string): string {
  // We put the user data under a `data` field so we can extract it later
  const payload = { data: { name, email, _id } };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// 2) Verify a JWT string (either from Authorization header or cookie)
//    Returns the decoded user data (ContextUser) or throws AuthenticationError.
export function authenticateToken(tokenOrHeader: string | undefined): ContextUser | null {
  if (!tokenOrHeader) return null;

  // If it looks like "Bearer <token>", extract the token portion
  const token = tokenOrHeader.startsWith('Bearer ')
    ? tokenOrHeader.split(' ')[1]
    : tokenOrHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Our payload shape was { data: { _id, name, email } }
    return decoded.data as ContextUser;
  } catch (err) {
    // Token is invalid or expired
    throw new AuthenticationError('Invalid/Expired token');
  }
}
