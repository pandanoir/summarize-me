import { useMutation, useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import {
  NexusGenFieldTypes,
  NexusGenArgTypes,
} from '../../generated/nexus-typegen';

export const ChallengeQuery = gql`
  query Challenge($id: ID!) {
    challenge(id: $id) {
      id
      title
      author {
        username
        id
      }
      labels {
        id
        name
      }
    }
  }
`;
const createAnswerMutation = gql`
  mutation CreateAnswer($content: String!, $challengeId: ID!) {
    createAnswer(content: $content, challengeId: $challengeId) {
      id
      content
    }
  }
`;
const createLikeMutation = gql`
  mutation CreateLike($answerId: ID!) {
    createLike(answerId: $answerId) {
      __typename
    }
  }
`;
const deleteLikeMutation = gql`
  mutation DeleteLike($answerId: ID!) {
    deleteLike(answerId: $answerId) {
      __typename
    }
  }
`;

const createChallengeMutation = gql`
  mutation CreateChallenge($title: String!) {
    createChallenge(title: $title) {
      id
      title
    }
  }
`;
export const useChallenge = (id: string) => {
  const {
    data: challenge,
    loading,
    error,
  } = useQuery<
    {
      challenge: NexusGenFieldTypes['Query']['challenge'] & {
        labels: NexusGenFieldTypes['Query']['labels'];
      } & {
        author: NexusGenFieldTypes['Query']['user'];
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
  >(createAnswerMutation, {
    refetchQueries: [ChallengeQuery],
  });

  const [likeAnswer] = useMutation<
    { createLike: Record<string, never> },
    NexusGenArgTypes['Mutation']['createLike']
  >(createLikeMutation, {
    refetchQueries: [ChallengeQuery],
  });
  const [unlikeAnswer] = useMutation<
    { deleteLike: Record<string, never> },
    NexusGenArgTypes['Mutation']['deleteLike']
  >(deleteLikeMutation, {
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
  const [sendAnswer, { error }] = useMutation<
    {
      createAnswer: Pick<
        NexusGenFieldTypes['Mutation']['createAnswer'],
        'id' | 'content'
      >;
    },
    NexusGenArgTypes['Mutation']['createAnswer']
  >(createAnswerMutation, {
    refetchQueries: [ChallengeQuery],
  });
  return [sendAnswer, error] as const;
};
export const useCreateChallenge = () => {
  const [createChallenge] = useMutation<
    {
      createChallenge: NexusGenFieldTypes['Mutation']['createChallenge'];
    },
    NexusGenArgTypes['Mutation']['createChallenge']
  >(createChallengeMutation);
  return createChallenge;
};
