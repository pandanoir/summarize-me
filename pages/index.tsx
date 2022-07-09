import {
  Box,
  Button,
  ChakraProvider,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Tag,
  VStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import {
  AllChallengesQuery,
  useAllChallenges,
} from '../src/hooks/useAllChallenges';
import { useIsSignIn } from '../src/hooks/useIsSignIn';
import { fetchInitialData } from '../src/utils/fetchInitialData';

const Home: NextPage = () => {
  const { challenges, loading, error } = useAllChallenges();
  const isSignIn = useIsSignIn();
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <ChakraProvider>
      <Head>
        <title>summarize me</title>
      </Head>
      <Box p={6} as="main">
        <HStack justify="space-between">
          <Heading>summarize me</Heading>
          {isSignIn ? (
            <Button as="a" href="/api/auth/logout">
              Sign out
            </Button>
          ) : (
            <Button as="a" href="/api/auth/login">
              Sign in/Sign up
            </Button>
          )}
        </HStack>

        <SimpleGrid gap={6} columns={{ sm: 2, lg: 3, '2xl': 4 }} py={12}>
          {challenges?.challenges.map(({ id, title, labels }) => (
            <VStack
              key={id}
              borderRadius="lg"
              p={3}
              boxShadow="md"
              align="left"
            >
              <Box>
                {title}
                <Button as="a" href={`/challenge/${id}`}>
                  挑戦する
                </Button>
              </Box>
              <HStack>
                {labels.map(({ id, name }) => (
                  <Link key={id} href={`/label/${name}`}>
                    <Tag variant="outline" width="max">
                      {name}
                    </Tag>
                  </Link>
                ))}
              </HStack>
            </VStack>
          ))}
        </SimpleGrid>

        <Button as="a" href="/tutorial">
          チュートリアルを受ける
        </Button>
      </Box>
    </ChakraProvider>
  );
};

export const getServerSideProps = async () => ({
  props: {
    ...(await fetchInitialData({
      query: AllChallengesQuery,
    })),
  },
});

export default Home;
