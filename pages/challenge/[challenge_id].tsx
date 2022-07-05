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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSendAnswer } from '../../src/hooks/useChallenge';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useUser } from '@auth0/nextjs-auth0';
import { useAnswers } from '../../src/hooks/useAnswers';
import { NextPageContext } from 'next';

type ServerProps = {
  challenge: {
    title: string;
    id: number;
    labels: { id: number; name: string }[];
  } | null;
};
const Challenge = ({ challenge }: ServerProps) => {
  const { user } = useUser();
  const isSignIn = typeof user !== 'undefined';
  const router = useRouter();
  const { challenge_id: challengeId } = router.query;
  const sendAnswer = useSendAnswer();
  const {
    answers,
    likeAnswer,
    unlikeAnswer,
    load: loadAnswers,
  } = useAnswers(Number(challengeId));

  const [showsAnswers, setShowsAnswers] = useState(false);
  const [value, setValue] = useState('');

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

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{ props: ServerProps }> => {
  const { challenge_id: challengeId } = context.query;
  const data = await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'Challenge',
      query: `
query Challenge($id: Int!) {
  challenge(id: $id) {
    id
    title
    labels {
      id
      name
    }
  }
}`,
      variables: { id: Number(challengeId) },
    }),
  });

  const { data: json, errors } = await data.json();
  if (errors) {
    return { props: { challenge: null } };
  }
  return { props: { challenge: json.challenge } };
};
