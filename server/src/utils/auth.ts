import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'dev-secret';

export const authenticateToken = (token: string) => {
  if (!token) {
    console.log('No token provided');
    return null;
  }

  try {
    const cleanedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded: any = jwt.verify(cleanedToken, JWT_SECRET, { maxAge: '2h' });
    return decoded?.data || null;
  } catch (error) {
    console.log('Invalid token:');
    return null;
  }
};

export const signToken = (name: string, email: string, _id: unknown) => {
  const payload = { name, email, _id };
  return jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: '2h' });
};
// export const authenticateToken = ({ req }: any) => {
//   let token = req.body.token || req.query.token || req.headers.authorization;
  
//   if (!token) {
//     console.log('No token found');
//     return req;
//   }

//   if (req.headers.authorization) {
//     token = token.split(' ').pop().trim();
//   }

//   if (!token) {
//     return req;
//   }

//   try {
//     const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
//     req.user = data;
//   } catch (err) {
//     console.log('Invalid token');
//   }

//   return req;
// };

// export const signToken = (name: string, email: string, _id: unknown) => {
//   const payload = { name, email, _id };
//   const secretKey: any = process.env.JWT_SECRET_KEY;

//   return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
// };

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
