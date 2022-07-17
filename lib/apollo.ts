import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';

export const createApolloClient = (cache: NormalizedCacheObject = {}) =>
  new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/graphql`,
    cache: new InMemoryCache().restore(cache),
    link: createUploadLink({
      uri: '/api/graphql',
      headers: { 'Apollo-Require-Preflight': 'true' },
    }),
  });
