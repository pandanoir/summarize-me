import {
  objectType,
  queryField,
  list,
  extendType,
  nonNull,
  stringArg,
  idArg,
} from 'nexus';

export const Answer = objectType({
  name: 'Answer',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('content');
    t.nonNull.id('challengeId');
    t.nonNull.id('authorId');
    t.nonNull.field('likeCount', {
      type: 'Int',
      resolve(parent, _args, ctx) {
        return ctx.prisma.like.count({
          where: { answerId: parent.id },
        });
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
  args: { challengeId: nonNull(idArg()) },
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
      args: { content: nonNull(stringArg()), challengeId: nonNull(idArg()) },
      resolve(_parent, { challengeId, content }, { user, prisma }) {
        if (!user)
          throw new Error(`You need to be logged in to perform an action`);
        if (content.length === 0) throw new Error('Content field is required');
        if (content.length > 280) throw new Error('The answer is too long');

        return prisma.answer.create({
          data: { content, challengeId, authorId: user.user.sub },
        });
      },
    });
  },
});
