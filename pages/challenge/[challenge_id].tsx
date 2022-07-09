import {
  Box,
  Heading,
  Button,
  ChakraProvider,
  Input,
  HStack,
  ListItem,
  UnorderedList,
  Text,
  Icon,
  Flex,
  Spinner,
  Tag,
  IconButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  ChallengeQuery,
  useChallenge,
  useSendAnswer,
} from '../../src/hooks/useChallenge';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsPlus } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { NextPageContext } from 'next';
import { useAnswers } from '../../src/hooks/useAnswers';
import { useIsSignIn } from '../../src/hooks/useIsSignIn';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  useMutation,
} from '@apollo/client';
import { gql } from 'apollo-server-micro';
import { NexusGenArgTypes, NexusGenFieldTypes } from 'nexus-typegen';

const createLabelMutation = gql`
  mutation CreateLabel($name: String!, $challengeId: Int!) {
    createLabel(name: $name, challengeId: $challengeId) {
      name
    }
  }
`;
const Challenge = () => {
  const router = useRouter();
  const challengeId = Number(router.query.challenge_id);
  const isSignIn = useIsSignIn();
  const { challenge, loading } = useChallenge(challengeId);
  const sendAnswer = useSendAnswer();
  const {
    answers,
    likeAnswer,
    unlikeAnswer,
    load: loadAnswers,
  } = useAnswers(challengeId);

  const [showsAnswers, setShowsAnswers] = useState(false);
  const [value, setValue] = useState('');

  const [addLabelMode, setAddLabelMode] = useState(false);
  const [newLabelValue, setNewLabelValue] = useState('');
  const [createLabel] = useMutation<
    { createLabel: NexusGenFieldTypes['Mutation']['createLabel'] },
    NexusGenArgTypes['Mutation']['createLabel']
  >(createLabelMutation);

  if (loading) {
    return <Spinner />;
  }
  if (!challenge) {
    return <p>not found</p>;
  }
  return (
    <ChakraProvider>
      <Box p={6} as="main">
        <HStack>
          <Heading>{challenge.title}</Heading>
          {challenge.labels.map(({ name, id }) => (
            <Tag variant="outline" key={id}>
              {name}
            </Tag>
          ))}
          {addLabelMode ? (
            <HStack
              spacing="0"
              as="form"
              onSubmit={(e) => {
                e.preventDefault();
                createLabel({
                  variables: { name: newLabelValue, challengeId },
                  refetchQueries: [ChallengeQuery],
                  onCompleted: () => {
                    setAddLabelMode(false);
                  },
                });
              }}
            >
              <IconButton
                size="xs"
                variant="unstyled"
                aria-label="remove"
                icon={<Icon as={FaTimes} />}
                onClick={() => setAddLabelMode(false)}
              />
              <Input
                required
                w="28"
                size="sm"
                rounded="md"
                placeholder="new label"
                value={newLabelValue}
                onChange={({ target: { value } }) => setNewLabelValue(value)}
              />
            </HStack>
          ) : (
            <IconButton
              size="sm"
              variant="outline"
              aria-label="add label"
              icon={<Icon as={BsPlus} />}
              onClick={() => {
                setAddLabelMode(true);
                setNewLabelValue('');
              }}
            />
          )}
        </HStack>
        <HStack>
          <Input
            placeholder="要約"
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
          />
          <Button
            onClick={() =>
              sendAnswer({
                variables: { content: value, challengeId: challenge.id },
              })
            }
          >
            投稿する
          </Button>
        </HStack>
        {!showsAnswers ? (
          <Button
            onClick={() => {
              setShowsAnswers(true);
              loadAnswers();
            }}
          >
            ほかの人の回答を見る
          </Button>
        ) : !answers ? (
          <Spinner />
        ) : answers.length === 0 ? (
          <Text>まだ投稿がありません</Text>
        ) : (
          <UnorderedList>
            {answers.map((answer) => (
              <ListItem key={answer.id}>
                {answer.content}
                {isSignIn ? (
                  <Box>
                    <Button
                      colorScheme="pink"
                      variant="outline"
                      onClick={() => {
                        if (answer.isLiked) {
                          unlikeAnswer({
                            variables: { answerId: answer.id },
                          });
                          return;
                        }
                        likeAnswer({ variables: { answerId: answer.id } });
                      }}
                    >
                      <Flex align="center">
                        <Icon
                          as={answer.isLiked ? AiFillHeart : AiOutlineHeart}
                        />
                        {answer.likeCount || ''}
                      </Flex>
                    </Button>
                  </Box>
                ) : (
                  <Flex color="pink.600" fontWeight="semibold" align="center">
                    <Icon as={AiOutlineHeart} />
                    {answer.likeCount || ''}
                  </Flex>
                )}
              </ListItem>
            ))}
          </UnorderedList>
        )}
        <Button as="a" href="/tutorial">
          チュートリアルを受ける
        </Button>
        <Button as="a" href="/">
          トップに戻る
        </Button>
      </Box>
    </ChakraProvider>
  );
};
export default Challenge;

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
export const getServerSideProps = async (context: NextPageContext) => {
  const challengeId = Number(context.query.challenge_id);
  if (!apolloClient)
    apolloClient = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri: 'http://localhost:3000/api/graphql',
        credentials: 'same-origin',
      }),
      cache: new InMemoryCache(),
    });

  await apolloClient.query({
    query: ChallengeQuery,
    variables: {
      id: challengeId,
    },
  });

  return { props: { initialData: apolloClient.cache.extract() } };
};
