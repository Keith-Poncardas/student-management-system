import { IncomingMessage } from 'http';
import prisma from '../lib/prisma';
import { verifyToken } from '../utils/jwt';
import { GraphQLContext } from '../types';

export async function createContext({ req }: { req: IncomingMessage }): Promise<GraphQLContext> {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return { user: null };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { user: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return { user };
}
