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
        uri: `${process.env.API_ENDPOINT}/api/graphql`,
        credentials: 'same-origin',
      }),
      cache: new InMemoryCache(),
    });

  await apolloClient.query<T, TVariables>(queryOpt);
  return { initialData: apolloClient.cache.extract() };
};

export const fetchData = async <T = any, TVariables = OperationVariables>(
  queryOpt: QueryOptions<TVariables, T>
) => {
  if (!apolloClient)
    apolloClient = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri: `${process.env.API_ENDPOINT}/api/graphql`,
        credentials: 'same-origin',
      }),
      cache: new InMemoryCache(),
    });

  return (await apolloClient.query<T, TVariables>(queryOpt)).data;
};
