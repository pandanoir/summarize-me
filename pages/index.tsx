import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  Box,
  Button,
  ChakraProvider,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAllChallenges } from '../src/hooks/useAllChallenges';

const Home: NextPage = () => {
  const { challenges, loading, error } = useAllChallenges();
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
        <Heading>summarize me</Heading>
        <Grid templateColumns={'repeat(1, 1fr)'} gap={6} py={12}>
          {challenges?.challenges.map(({ id, title, answers }) => (
            <GridItem key={id}>
              <Box borderWidth={1} borderRadius="lg" p={3}>
                {title}
                <Button as="a" href={`/challenge/${id}`}>
                  挑戦する
                </Button>
              </Box>
            </GridItem>
          ))}
        </Grid>
        <Button as="a" href="/tutorial">
          チュートリアルを受ける
        </Button>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
