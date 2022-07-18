import { getSession } from '@auth0/nextjs-auth0';
import {
  Box,
  Button,
  ChakraProvider,
  HStack,
  Link,
  Text,
  SimpleGrid,
  Tag,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AiFillTag } from 'react-icons/ai';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { Header } from '../src/components/Header';
import {
  ChallengeChunkQuery,
  useAllChallenges,
} from '../src/hooks/useAllChallenges';
import { fetchInitialData } from '../src/utils/fetchInitialData';

type Props = { isSignedIn: boolean };
const Home: NextPage<Props> = ({ isSignedIn }) => {
  const { query } = useRouter();
  const after = Array.isArray(query.after) ? query.after[0] : query.after;
  const before = Array.isArray(query.before) ? query.before[0] : query.before;
  const { challenges, loading, error } = useAllChallenges({ after, before });

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
      <Header />
      <VStack p={6} as="main" spacing={12} align="left">
        <SimpleGrid gap={6} columns={{ sm: 2, lg: 3, '2xl': 4 }}>
          {challenges?.challenges.nodes?.map(({ id, title, labels }) => (
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
                      <Icon as={AiFillTag} />
                      {name}
                    </Tag>
                  </Link>
                ))}
              </HStack>
            </VStack>
          ))}
        </SimpleGrid>

        <HStack>
          {challenges?.challenges.pageInfo.hasPreviousPage && (
            <Button
              as="a"
              href={`/?before=${challenges?.challenges.pageInfo.startCursor}`}
            >
              <Icon as={MdNavigateBefore} /> prev page
            </Button>
          )}
          {challenges?.challenges.pageInfo.hasNextPage && (
            <Button
              as="a"
              href={`/?after=${challenges?.challenges.pageInfo.endCursor}`}
            >
              next page <Icon as={MdNavigateNext} />
            </Button>
          )}
        </HStack>
        {isSignedIn ? (
          <Button as="a" href="/challenge/create" w="max">
            問題を作る
          </Button>
        ) : (
          <Text>ログインすると問題を作れます</Text>
        )}

        <Button as="a" href="/tutorial" w="max">
          チュートリアルを受ける
        </Button>
      </VStack>
    </ChakraProvider>
  );
};

export default Home;

export const getServerSideProps = async ({
  query,
  req,
  res,
}: NextPageContext) => {
  const after = Array.isArray(query.after) ? query.after[0] : query.after;
  const before = Array.isArray(query.before) ? query.before[0] : query.before;

  const [session, initialData] = await Promise.all([
    req && res ? getSession(req, res) : null,
    fetchInitialData({
      query: ChallengeChunkQuery,
      variables: before ? { before, last: 10 } : { after, first: 10 },
    }),
  ]);
  const isSignedIn = !!session?.user;

  const props: Props = {
    ...initialData,
    isSignedIn,
  };
  return {
    props,
  };
};
