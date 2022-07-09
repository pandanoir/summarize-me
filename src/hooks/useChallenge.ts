import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import { NexusGenFieldTypes, NexusGenArgTypes } from 'nexus-typegen';

export const ChallengeQuery = gql`
  query Challenge($id: Int!) {
    challenge(id: $id) {
      id
      title
      labels {
        id
        name
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
const createLikeQuery = gql`
  mutation CreateLike($answerId: Int!) {
    createLike(answerId: $answerId) {
      __typename
    }
  }
`;
const deleteLikeQuery = gql`
  mutation DeleteLike($answerId: Int!) {
    deleteLike(answerId: $answerId) {
      __typename
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
        labels: NexusGenFieldTypes['Query']['labels'];
      };
    },
    NexusGenArgTypes['Query']['challenge']
  >(ChallengeQuery, { variables: { id } });

  const [sendAnswer] = useMutation<
    {
      createAnswer: Pick<
        NexusGenFieldTypes['Mutation']['createAnswer'],
        'id' | 'content'
      >;
    },
    NexusGenArgTypes['Mutation']['createAnswer']
  >(createAnswerQuery, {
    refetchQueries: [ChallengeQuery],
  });

  const [likeAnswer] = useMutation<
    { createLike: Record<string, never> },
    NexusGenArgTypes['Mutation']['createLike']
  >(createLikeQuery, {
    refetchQueries: [ChallengeQuery],
  });
  const [unlikeAnswer] = useMutation<
    { deleteLike: Record<string, never> },
    NexusGenArgTypes['Mutation']['deleteLike']
  >(deleteLikeQuery, {
    refetchQueries: [ChallengeQuery],
  });

  return {
    challenge: challenge?.challenge,
    sendAnswer,
    likeAnswer,
    unlikeAnswer,
    loading,
    error,
  };
};
export const useSendAnswer = () => {
  const [sendAnswer] = useMutation<
    {
      createAnswer: Pick<
        NexusGenFieldTypes['Mutation']['createAnswer'],
        'id' | 'content'
      >;
    },
    NexusGenArgTypes['Mutation']['createAnswer']
  >(createAnswerQuery, {
    refetchQueries: [ChallengeQuery],
  });
  return sendAnswer;
};
