import {
  objectType,
  queryField,
  list,
  extendType,
  nonNull,
  idArg,
} from 'nexus';

export const Like = objectType({
  name: 'Like',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('userId');
  },
});

export const LikeQuery = queryField('likes', {
  type: list('Like'),
  args: {
    answerId: nonNull(idArg()),
  },
  resolve(_parent, { answerId }, ctx) {
    return ctx.prisma.like.findMany({ where: { answerId } });
  },
});

export const CreateLikeMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createLike', {
      type: 'Like',
      args: { answerId: nonNull(idArg()) },
      resolve(_parent, { answerId }, { user, prisma }) {
        if (!user)
          throw new Error(`You need to be logged in to perform an action`);
        return prisma.like.create({
          data: {
            answerId,
            userId: user.user.sub,
          },
        });
      },
    });
  },
});

export const DeleteLikeMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteLike', {
      type: 'Like',
      args: { answerId: nonNull(idArg()) },
      resolve(_parent, { answerId }, { user, prisma }) {
        if (!user)
          throw new Error(`You need to be logged in to perform an action`);
        return prisma.like.delete({
          where: {
            userId_answerId: {
              answerId,
              userId: user.user.sub,
            },
          },
        });
      },
    });
  },
});
