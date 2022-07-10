import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

export const createApolloClient = (cache: NormalizedCacheObject = {}) =>
  new ApolloClient({
    uri: `http://${process.env.HOSTNAME}/api/graphql`,
    cache: new InMemoryCache().restore(cache),
  });
