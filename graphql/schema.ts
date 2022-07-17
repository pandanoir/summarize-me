import { makeSchema, connectionPlugin } from 'nexus';
import { join } from 'path';
import * as Challenge from './types/Challenge';
import * as Answer from './types/Answer';
import * as Like from './types/Like';
import * as Label from './types/Label';
import * as User from './types/User';
import * as Upload from './types/Upload';

export const schema = makeSchema({
  types: { ...Challenge, ...Answer, ...Like, ...Label, ...User, ...Upload },
  outputs: {
    typegen: join(process.cwd(), 'generated', 'nexus-typegen.d.ts'),
    schema: join(process.cwd(), 'generated', 'schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
  plugins: [
    connectionPlugin({
      includeNodesField: true,
      extendConnection: {
        totalCount: { type: 'Int' },
      },
    }),
  ],
});
