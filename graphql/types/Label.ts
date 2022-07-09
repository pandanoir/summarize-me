import {
  objectType,
  queryField,
  list,
  nonNull,
  intArg,
  stringArg,
  extendType,
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

export const CreateLabelMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createLabel', {
      type: 'Label',
      args: { name: nonNull(stringArg()), challengeId: nonNull(intArg()) },
      async resolve(_parent, { name, challengeId }, ctx) {
        await ctx.prisma.challenge.update({
          where: { id: challengeId },
          data: {
            labels: { connectOrCreate: { where: { name }, create: { name } } },
          },
        });
        return (await ctx.prisma.label.findUnique({ where: { name } }))!;
      },
    });
  },
});
1;
