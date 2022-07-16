import { handleAuth, handleCallback, HandlerError } from '@auth0/nextjs-auth0';
import { getGravatarIcon } from '../../../src/utils/getGravatarIcon';
import { prisma } from '../../../lib/prisma';

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback: async (_req, _res, session) => {
          const iconUrl = getGravatarIcon(session.user.email);
          session.user.iconUrl = iconUrl;
          await prisma.user.upsert({
            where: {
              id: session.user.sub,
            },
            update: {},
            create: {
              id: session.user.sub,
              iconUrl,
              username: session.user.nickname,
            },
          });
          return session;
        },
      });
    } catch (error: unknown) {
      if (error instanceof HandlerError)
        res.status(error.status || 500).end(error.message);
    }
  },
});
