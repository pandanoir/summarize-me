import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  queryField,
  list,
  intArg,
} from 'nexus';

export const Challenge = objectType({
  name: 'Challenge',
  definition(t) {
    t.nonNull.int('id');
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
    nodes(root, args, ctx, info) {
      if (args.before && args.last) {
        return ctx.prisma.challenge.findMany({
          take: -args.last - 1,
          cursor: { id: Number(args.before) },
          include: { answers: true },
        });
      }
      return ctx.prisma.challenge.findMany({
        take: (args.first || 10) + 1,
        ...(args.after && { cursor: { id: Number(args.after) } }),
        include: { answers: true },
      });
    },
  });
});

export const ChallengeQuery = queryField('challenge', {
  type: 'Challenge',
  args: {
    id: nonNull(intArg()),
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
