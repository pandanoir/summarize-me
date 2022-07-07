import {
  objectType,
  queryField,
  list,
  nonNull,
  intArg,
  stringArg,
} from 'nexus';

export const Label = objectType({
  name: 'Label',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.nonNull.list.field('challenges', {
      type: nonNull('Challenge'),
      resolve(parent, _args, ctx) {
        return ctx.prisma.label
          .findUnique({ where: { id: parent.id } })
          .challenges();
      },
    });
  },
});

export const LabelsQuery = queryField('labels', {
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

export const LabelQuery = queryField('label', {
  type: 'Label',
  args: {
    name: nonNull(stringArg()),
  },
  resolve(_parent, { name }, ctx) {
    return ctx.prisma.label.findUnique({ where: { name } });
  },
});
