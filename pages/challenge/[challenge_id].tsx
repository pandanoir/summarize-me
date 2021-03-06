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
  useToast,
  Link,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  ChallengeQuery,
  useChallenge,
  useSendAnswer,
} from '../../src/hooks/useChallenge';
import { AiFillHeart, AiFillTag, AiOutlineHeart } from 'react-icons/ai';
import { BsPlus } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { NextPage, NextPageContext } from 'next';
import { useAnswers } from '../../src/hooks/useAnswers';
import { useMutation } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../../generated/nexus-typegen';
import { fetchInitialData } from '../../src/utils/fetchInitialData';
import { getSession } from '@auth0/nextjs-auth0';
import { Header } from '../../src/components/Header';

const createLabelMutation = gql`
  mutation CreateLabel($name: String!, $challengeId: ID!) {
    createLabel(name: $name, challengeId: $challengeId) {
      name
    }
  }
`;

type Props = { isSignedIn: boolean };
const Challenge: NextPage<Props> = ({ isSignedIn }) => {
  const { query } = useRouter();
  const challengeId = Array.isArray(query.challenge_id)
    ? query.challenge_id[0]
    : query.challenge_id || '';
  const { challenge, loading } = useChallenge(challengeId);
  const [sendAnswer, sendAnswerError] = useSendAnswer();
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
  const toast = useToast();

  useEffect(() => {
    if (sendAnswerError?.message === 'Content field is required') {
      toast({
        title: '?????????????????????????????????',
        status: 'warning',
        position: 'bottom-right',
      });
    }
    if (sendAnswerError?.message === 'The answer is too long') {
      toast({
        title: '???????????????????????????280???????????????????????????????????????',
        status: 'warning',
        position: 'bottom-right',
      });
    }
  }, [sendAnswerError, toast]);

  if (loading) {
    return <Spinner />;
  }
  if (!challenge) {
    return <p>not found</p>;
  }
  return (
    <ChakraProvider>
      <Header />
      <VStack p={6} as="main" spacing={3} align="left">
        <Flex wrap="wrap" gap="2">
          <Heading>{challenge.title}</Heading>
          <Text alignSelf="end">
            created by{' '}
            <Link color="blue.400" href={`/user/${challenge.author?.id}`}>
              {challenge.author?.username}
            </Link>
          </Text>
          <Flex wrap="wrap" gap="2" align="center">
            {challenge.labels.map(({ name, id }) => (
              <Link key={id} href={`/label/${name}`}>
                <Tag variant="outline" wordBreak="keep-all">
                  <Icon as={AiFillTag} />
                  {name}
                </Tag>
              </Link>
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
          </Flex>
        </Flex>
        <Tooltip
          hasArrow
          isDisabled={isSignedIn}
          shouldWrapChildren
          label="???????????????????????????"
          bg="red.600"
        >
          <HStack>
            <Input
              placeholder="??????"
              value={value}
              onChange={({ target: { value } }) => setValue(value)}
              disabled={!isSignedIn}
            />
            <Button
              onClick={() =>
                sendAnswer({
                  variables: { content: value, challengeId: challenge.id },
                  onCompleted: () => {
                    setShowsAnswers(true);
                    loadAnswers();
                  },
                }).catch(() => {})
              }
              disabled={!isSignedIn}
            >
              ????????????
            </Button>
          </HStack>
        </Tooltip>
        {!showsAnswers ? (
          <Button
            onClick={() => {
              setShowsAnswers(true);
              loadAnswers();
            }}
            w="max"
          >
            ??????????????????????????????
          </Button>
        ) : !answers ? (
          <Spinner />
        ) : answers.length === 0 ? (
          <Text>??????????????????????????????</Text>
        ) : (
          <UnorderedList>
            {answers.map((answer) => (
              <ListItem key={answer.id}>
                {answer.content}
                {isSignedIn ? (
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
        <Button as="a" href="/tutorial" w="max">
          ?????????????????????????????????
        </Button>
        <Button as="a" href="/" w="max">
          ??????????????????
        </Button>
      </VStack>
    </ChakraProvider>
  );
};
export default Challenge;

export const getServerSideProps = async ({
  query,
  req,
  res,
}: NextPageContext) => {
  const challengeId = query.challenge_id;
  if (!challengeId) return { props: { initialData: null } };
  const [session, initialData] = await Promise.all([
    req && res ? getSession(req, res) : null,
    fetchInitialData({
      query: ChallengeQuery,
      variables: {
        id: challengeId,
      },
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
