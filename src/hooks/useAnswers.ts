import { useLazyQuery, useMutation } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import {
  NexusGenFieldTypes,
  NexusGenArgTypes,
} from '../../generated/nexus-typegen';

const ChallengeQuery = gql`
  query Answers($challengeId: Id!) {
    answers(challengeId: $challengeId) {
      id
      content
      likeCount
      isLiked
    }
  }
`;
const createLikeQuery = gql`
  mutation CreateLike($answerId: Id!) {
    createLike(answerId: $answerId) {
      __typename
    }
  }
`;
const deleteLikeQuery = gql`
  mutation DeleteLike($answerId: Id!) {
    deleteLike(answerId: $answerId) {
      __typename
    }
  }
`;

export const useAnswers = (challengeId: string) => {
  const [load, { data: answers, loading, error }] = useLazyQuery<
    {
      answers: Pick<
        NexusGenFieldTypes['Answer'],
        'id' | 'content' | 'likeCount' | 'isLiked'
      >[];
    },
    NexusGenArgTypes['Query']['answers']
  >(ChallengeQuery, { variables: { challengeId } });

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
    load,
    answers: answers?.answers,
    likeAnswer,
    unlikeAnswer,
    loading,
    error,
  };
};
