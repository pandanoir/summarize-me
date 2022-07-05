import { getSession, Session } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export type Context = {
  prisma: PrismaClient;
  user?: Session | null;
};

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> => ({
  prisma,
  user: getSession(req, res),
});
