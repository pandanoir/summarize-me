import {
  ApolloClient,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
export const fetchInitialData = async <
  T = any,
  TVariables = OperationVariables
>(
  queryOpt: QueryOptions<TVariables, T>
) => {
  if (!apolloClient)
    apolloClient = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri: 'http://localhost:3000/api/graphql',
        credentials: 'same-origin',
      }),
      cache: new InMemoryCache(),
    });

  await apolloClient.query<T, TVariables>(queryOpt);
  return { initialData: apolloClient.cache.extract() };
};
