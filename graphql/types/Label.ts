import { objectType, queryField, list, nonNull, intArg } from 'nexus';

export const Label = objectType({
  name: 'Label',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
  },
});

export const LabelQuery = queryField('labels', {
  type: nonNull(list(nonNull('Label'))),
  args: {
    challengeId: nonNull(intArg()),
  },
  resolve(_parent, { challengeId }, ctx) {
    return ctx.prisma.challenge
      .findUnique({ where: { id: challengeId } })
      .labels();
  },
});
