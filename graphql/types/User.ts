import { objectType, queryField, nonNull, idArg } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('username');
    t.nonNull.string('iconUrl');
  },
});

export const UserQuery = queryField('user', {
  type: 'User',
  args: {
    id: nonNull(idArg()),
  },
  resolve(_parent, { id }, ctx) {
    return ctx.prisma.user.findUnique({ where: { id } });
  },
});
