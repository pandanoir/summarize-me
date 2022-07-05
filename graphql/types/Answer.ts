import {
  objectType,
  queryField,
  list,
  extendType,
  nonNull,
  stringArg,
  intArg,
} from 'nexus';

export const Answer = objectType({
  name: 'Answer',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('content');
    t.nonNull.int('challengeId');
    t.nonNull.field('likeCount', {
      type: 'Int',
      async resolve(parent, _args, ctx) {
        return (
          await ctx.prisma.like.aggregate({
            _count: true,
            where: { answerId: parent.id },
          })
        )._count;
      },
    });
    t.nonNull.field('isLiked', {
      type: 'Boolean',
      async resolve(parent, _args, { prisma, user }) {
        if (!user) return false;
        return (
          (await prisma.like.count({
            where: { answerId: parent.id, userId: user.user.sub },
          })) === 1
        );
      },
    });
  },
});

export const AnswersQuery = queryField('answers', {
  type: nonNull(list('Answer')),
  args: { challengeId: nonNull(intArg()) },
  resolve(_parent, { challengeId }, ctx) {
    return ctx.prisma.answer.findMany({
      where: { challengeId },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });
  },
});

export const CreateAnswerMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createAnswer', {
      type: 'Answer',
      args: { content: nonNull(stringArg()), challengeId: nonNull(intArg()) },
      resolve(_parent, { challengeId, content }, ctx) {
        return ctx.prisma.answer.create({
          data: { content, challengeId },
        });
      },
    });
  },
});
