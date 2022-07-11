import { useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../../generated/nexus-typegen';

export const ChallengeChunkQuery = gql`
  query ChallengeChunk(
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    challenges(after: $after, before: $before, first: $first, last: $last) {
      nodes {
        id
        title
        labels {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
export const useAllChallenges = ({
  after,
  before,
}: {
  after?: string;
  before?: string;
} = {}) => {
  const variables = before ? { before, last: 10 } : { after, first: 10 };
  const {
    data: challenges,
    loading,
    error,
  } = useQuery<
    {
      challenges: Omit<NexusGenFieldTypes['Query']['challenges'], 'nodes'> & {
        nodes: (NexusGenFieldTypes['Query']['challenges']['nodes'][number] & {
          labels: NexusGenFieldTypes['Label'][];
        })[];
      };
    },
    NexusGenArgTypes['Query']['challenges']
  >(ChallengeChunkQuery, { variables });
  return { challenges, loading, error };
};
