import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';

const ChallengeQuery = gql`
  query Challenge($challengeId: Int!) {
    challenge(id: $challengeId) {
      id
      title
      answers {
        content
        likeCount
      }
    }
  }
`;
const createAnswerQuery = gql`
  mutation CreateAnswer($content: String!, $challengeId: Int!) {
    createAnswer(content: $content, challengeId: $challengeId) {
      id
      content
    }
  }
`;

export const useChallenge = (id: number) => {
  const {
    data: challenge,
    loading,
    error,
  } = useQuery<{
    challenge: {
      answers: {
        challengeId: number;
        content: string;
        id: number;
        likeCount?: number;
      }[];
      id: number;
      title: string;
    };
  }>(ChallengeQuery, { variables: { challengeId: id } });

  const [sendAnswer] = useMutation(createAnswerQuery, {
    refetchQueries: [ChallengeQuery],
  });

  return { challenge: challenge?.challenge, sendAnswer, loading, error };
};
