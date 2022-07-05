import {
  Box,
  Button,
  ChakraProvider,
  Heading,
  HStack,
  SimpleGrid,
  Tag,
  VStack,
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
        <SimpleGrid gap={6} columns={{ sm: 2, lg: 3, '2xl': 4 }} py={12}>
          {challenges?.challenges.map(({ id, title, labels }) => (
            <VStack
              key={id}
              borderWidth={1}
              borderRadius="lg"
              p={3}
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
                  <Tag variant="outline" key={id} width="max">
                    {name}
                  </Tag>
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

export default Home;
