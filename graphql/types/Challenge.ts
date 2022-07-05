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

export const ChallengesQuery = queryField('challenges', {
  type: list('Challenge'),
  resolve(_parent, _args, ctx) {
    return ctx.prisma.challenge.findMany({
      include: { answers: true },
    });
  },
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
      args: { title: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.challenge.create({
          data: { title: args.title },
        });
      },
    });
  },
});
