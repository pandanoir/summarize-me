import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  queryField,
  list,
  idArg,
} from 'nexus';

export const Challenge = objectType({
  name: 'Challenge',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('title');
    t.nonNull.string('authorId');
    t.nonNull.list.field('labels', {
      type: nonNull('Label'),
      resolve(parent, _args, ctx) {
        return ctx.prisma.challenge
          .findUnique({
            where: { id: parent.id },
          })
          .labels();
      },
    });
    t.nonNull.list.field('answers', {
      type: nonNull('Answer'),
      resolve(parent, _args, ctx) {
        return ctx.prisma.challenge
          .findUnique({
            where: { id: parent.id },
          })
          .answers();
      },
    });
  },
});

export const ChallengesQuery = queryField((t) => {
  t.nonNull.connectionField('challenges', {
    type: Challenge,
    nonNullDefaults: {
      output: true,
    },
    cursorFromNode: (node) => node.id,
    nodes(_, args, { prisma }) {
      let cursor: string | null | undefined;
      let take: number | undefined;
      if (args.last != null && args.before != null) {
        return prisma.challenge.findMany({
          cursor: { id: args.before },
          skip: 1,
          take: -(args.last + 1),
        });
      }
      cursor = args.after;
      take = args.first! + 1; // first も last もなかった場合、connectionPlugin がエラーを吐くので ! を使っている
      return prisma.challenge.findMany({
        cursor: cursor != null ? { id: cursor } : undefined,
        skip: cursor != null ? 1 : 0,
        take,
      });
    },
    totalCount(_par, _args, { prisma }) {
      return prisma.challenge.count();
    },
  });
});

export const ChallengeQuery = queryField('challenge', {
  type: 'Challenge',
  args: {
    id: nonNull(idArg()),
  },
  resolve(_parent, { id }, ctx) {
    return ctx.prisma.challenge.findFirst({
      where: { id },
      include: { answers: true },
    });
  },
});

export const CreateChallengeMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createChallenge', {
      type: 'Challenge',
      args: {
        title: nonNull(stringArg()),
        labels: list(nonNull(stringArg())),
      },
      resolve(_parent, { title, labels }, { user, prisma }) {
        if (!user)
          throw new Error(`You need to be logged in to perform an action`);

        return prisma.challenge.create({
          data: {
            title,
            authorId: user.user.sub,
            labels: labels
              ? {
                  connectOrCreate: labels.map((label) => ({
                    where: { name: label },
                    create: { name: label },
                  })),
                }
              : undefined,
          },
        });
      },
    });
  },
});
