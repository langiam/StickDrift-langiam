import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Context } from '../schemas/context.js';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '30d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not set in environment');
}

export interface ContextUser {
  _id: string;
  name: string;
  email: string;
}

export function signToken(profile: ContextUser): string {
  const payload = {
    data: {
      _id: profile._id,
      name: profile.name,
      email: profile.email,
    },
  };

  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (err) {
    console.error('[signToken error]', err);
    throw new Error('Failed to sign token');
  }
}

export function authenticateToken(tokenOrHeader: string | undefined): Context {
  if (!tokenOrHeader) return { user: null };

  const token = tokenOrHeader.startsWith('Bearer ')
    ? tokenOrHeader.split(' ')[1]
    : tokenOrHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { user: decoded.data as ContextUser };
  } catch (err) {
    console.error('[authenticateToken error]', err);
    return { user: null }; // ⚠️ do NOT throw here, just return null
  }
}
