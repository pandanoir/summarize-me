import { useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import { NexusGenFieldTypes } from 'nexus-typegen';

const AllChallengesQuery = gql`
  query {
    challenges {
      id
      title
      labels {
        id
        name
      }
      answers {
        content
      }
    }
  }
`;

export const useAllChallenges = () => {
  const {
    data: challenges,
    loading,
    error,
  } = useQuery<{ challenges: NexusGenFieldTypes['Challenge'][] }>(
    AllChallengesQuery
  );
  return { challenges, loading, error };
};
