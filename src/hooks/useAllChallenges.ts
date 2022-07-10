import { useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import { NexusGenFieldTypes } from '../../generated/nexus-typegen';

export const AllChallengesQuery = gql`
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
