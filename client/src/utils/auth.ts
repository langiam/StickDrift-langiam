import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

const secret = process.env.JWT_SECRET || 'fallback-secret';
const expiration = '2h';

export interface ContextUser {
  _id: string;
  email: string;
  name: string;
}

// Create a signed token for a user
export const signToken = ({ name, email, _id }: ContextUser): string => {
  return jwt.sign({ _id, email, name }, secret, { expiresIn: expiration });
};

// Verify token and return user context (or null if invalid/missing)
export const authenticateToken = async (
  authHeader: string | undefined
): Promise<ContextUser | null> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret) as ContextUser;
    return decoded;
  } catch (err) {
    throw new GraphQLError('Invalid or expired token.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};
