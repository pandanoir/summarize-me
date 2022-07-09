import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../lib/apollo';
import { UserProvider } from '@auth0/nextjs-auth0';
import { useMemo } from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useMemo(
    () =>
      pageProps.initialData
        ? createApolloClient(pageProps.initialData)
        : createApolloClient(),
    [pageProps]
  );
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </UserProvider>
  );
};
export default MyApp;
