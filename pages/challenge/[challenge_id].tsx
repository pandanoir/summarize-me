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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useChallenge } from '../../src/hooks/useChallenge';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Challenge = () => {
  const router = useRouter();
  const { challenge_id: challengeId } = router.query;
  const { challenge, sendAnswer, likeAnswer, unlikeAnswer, loading, error } =
    useChallenge(Number(challengeId));

  const [showsAnswers, setShowsAnswers] = useState(false);
  const [value, setValue] = useState('');

  if (loading) {
    return <p>loading...</p>;
  }
  if (!challenge) {
    return <p>not found</p>;
  }
  return (
    <ChakraProvider>
      <Box p={6} as="main">
        <Heading>{challenge.title}</Heading>
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
        {showsAnswers ? (
          challenge.answers.length > 0 ? (
            <UnorderedList>
              {challenge.answers.map((answer) => (
                <ListItem key={answer.id}>
                  {answer.content}
                  <Button
                    colorScheme="pink"
                    variant="outline"
                    leftIcon={
                      <Icon
                        as={answer.isLiked ? AiFillHeart : AiOutlineHeart}
                      />
                    }
                    onClick={() => {
                      if (answer.isLiked) {
                        unlikeAnswer({ variables: { answerId: answer.id } });
                        return;
                      }
                      likeAnswer({ variables: { answerId: answer.id } });
                    }}
                  >
                    {answer.likeCount || ''}
                  </Button>
                </ListItem>
              ))}
            </UnorderedList>
          ) : (
            <Text>まだ投稿がありません</Text>
          )
        ) : (
          <Button onClick={() => setShowsAnswers(true)}>
            ほかの人の回答を見る
          </Button>
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
export const getServerSideProps = withPageAuthRequired();
