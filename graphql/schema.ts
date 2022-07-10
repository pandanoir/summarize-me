import { makeSchema } from 'nexus';
import { join } from 'path';
import * as Challenge from './types/Challenge';
import * as Answer from './types/Answer';
import * as Like from './types/Like';
import * as Label from './types/Label';

export const schema = makeSchema({
  types: { ...Challenge, ...Answer, ...Like, ...Label },
  outputs: {
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    schema: join(process.cwd(), 'generated', 'schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
});
