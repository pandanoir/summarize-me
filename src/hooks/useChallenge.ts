import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import { NexusGenFieldTypes, NexusGenArgTypes } from 'nexus-typegen';

const ChallengeQuery = gql`
  query Challenge($id: Int!) {
    challenge(id: $id) {
      id
      title
      answers {
        id
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
  } = useQuery<
    {
      challenge: NexusGenFieldTypes['Query']['challenge'] & {
        answers: Pick<
          NexusGenFieldTypes['Answer'],
          'id' | 'content' | 'likeCount'
        >[];
      };
    },
    NexusGenArgTypes['Query']['challenge']
  >(ChallengeQuery, { variables: { id } });

  const [sendAnswer] = useMutation(createAnswerQuery, {
    refetchQueries: [ChallengeQuery],
  });

  return { challenge: challenge?.challenge, sendAnswer, loading, error };
};
