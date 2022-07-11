import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

export const createApolloClient = (cache: NormalizedCacheObject = {}) =>
  new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/graphql`,
    cache: new InMemoryCache().restore(cache),
  });
