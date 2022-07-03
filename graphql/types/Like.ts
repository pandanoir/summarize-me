import {
  objectType,
  queryField,
  list,
  extendType,
  nonNull,
  stringArg,
  intArg,
} from 'nexus';

export const Like = objectType({
  name: 'Like',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('userId');
  },
});

export const LikeQuery = queryField('likes', {
  type: list('Like'),
  args: {
    answerId: nonNull(intArg()),
  },
  resolve(_parent, { answerId }, ctx) {
    return ctx.prisma.like.findMany({ where: { answerId } });
  },
});
