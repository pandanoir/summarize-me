import { makeSchema } from 'nexus';
import { join } from 'path';
import * as Challenge from './types/Challenge';
import * as Answer from './types/Answer';
import * as Like from './types/Like';

export const schema = makeSchema({
  types: { ...Challenge, ...Answer, ...Like },
  outputs: {
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
});
