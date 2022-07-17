// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import processRequest from 'graphql-upload/processRequest.js';
import { ApolloServer } from 'apollo-server-micro';
import { createContext } from '../../graphql/context';
import { schema } from '../../graphql/schema';
import Cors from 'micro-cors';

const cors = Cors();

const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  csrfPrevention: true,
});
const startServer = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  const contentType = req.headers['content-type'];
  if (contentType && contentType.startsWith('multipart/form-data')) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.filePayload = await processRequest(req, res);
  }

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
