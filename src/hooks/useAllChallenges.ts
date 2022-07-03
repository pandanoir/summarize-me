import { useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';

const AllChallengesQuery = gql`
  query {
    challenges {
      id
      title
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
  } = useQuery<{
    challenges: {
      id: string;
      title: string;
      answers: {
        content: string;
      }[];
    }[];
  }>(AllChallengesQuery);
  return { challenges, loading, error };
};
