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
  Stack,
  Link,
  VStack,
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
import { NextPageContext } from 'next';
import { useAnswers } from '../../src/hooks/useAnswers';
import { useIsSignIn } from '../../src/hooks/useIsSignIn';
import { useMutation } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../../generated/nexus-typegen';
import { fetchInitialData } from '../../src/utils/fetchInitialData';

const createLabelMutation = gql`
  mutation CreateLabel($name: String!, $challengeId: ID!) {
    createLabel(name: $name, challengeId: $challengeId) {
      name
    }
  }
`;
const Challenge = () => {
  const { query } = useRouter();
  const challengeId = Array.isArray(query.challenge_id)
    ? query.challenge_id[0]
    : query.challenge_id || '';
  const isSignIn = useIsSignIn();
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
        title: '要約を入力してください',
        status: 'warning',
        position: 'bottom-right',
      });
    }
    if (sendAnswerError?.message === 'The answer is too long') {
      toast({
        title: '要約が長すぎます。280文字以内で解答してください',
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
      <VStack p={6} as="main" spacing={3} align="left">
        <Stack direction={['column', 'row']}>
          <Heading>{challenge.title}</Heading>
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
        </Stack>
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
              }).catch(() => {})
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
            w="max"
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
        <Button as="a" href="/tutorial" w="max">
          チュートリアルを受ける
        </Button>
        <Button as="a" href="/" w="max">
          トップに戻る
        </Button>
      </VStack>
    </ChakraProvider>
  );
};
export default Challenge;

export const getServerSideProps = async (context: NextPageContext) => {
  const challengeId = context.query.challenge_id;
  if (!challengeId) return { props: { initialData: null } };
  return {
    props: {
      ...(await fetchInitialData({
        query: ChallengeQuery,
        variables: {
          id: challengeId,
        },
      })),
    },
  };
};
