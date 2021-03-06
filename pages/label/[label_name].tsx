import {
  Box,
  Heading,
  ChakraProvider,
  HStack,
  Spinner,
  Button,
  SimpleGrid,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { gql } from 'apollo-server-micro';
import { useQuery } from '@apollo/client';
import { NexusGenFieldTypes } from '../../generated/nexus-typegen';
import { useRouter } from 'next/router';
import { AiFillTag } from 'react-icons/ai';
import { Header } from '../../src/components/Header';

type ServerProps = {
  label: {
    id: number;
    name: string;
  } | null;
};

const LabelQuery = gql`
  query Label($name: String!) {
    label(name: $name) {
      id
      name
      challenges {
        id
        title
      }
    }
  }
`;
const Label = ({ label }: ServerProps) => {
  const router = useRouter();
  const { data, loading } = useQuery<{
    label: NexusGenFieldTypes['Label'];
  }>(LabelQuery, {
    variables: { name: router.query.label_name },
  });

  return (
    <ChakraProvider>
      <Header />
      {!label ? (
        <p>not found</p>
      ) : loading ? (
        <Spinner />
      ) : (
        <Box p={6} as="main">
          <HStack>
            <Heading>
              <Icon as={AiFillTag} />
              {label.name}
            </Heading>
          </HStack>

          <SimpleGrid gap={6} columns={{ sm: 2, lg: 3, '2xl': 4 }} py={12}>
            {data?.label.challenges.map(({ id, title }) => (
              <VStack
                key={id}
                borderWidth={1}
                borderRadius="lg"
                p={3}
                align="left"
              >
                <Box>
                  {title}
                  <Button as="a" href={`/challenge/${id}`}>
                    挑戦する
                  </Button>
                </Box>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      )}{' '}
    </ChakraProvider>
  );
};
export default Label;

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{ props: ServerProps }> => {
  const { label_name: labelName } = context.query;
  const data = await fetch(`${process.env.API_ENDPOINT}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'Label',
      query: `
query Label($name: String!) {
  label(name: $name) {
    id
    name
  }
}`,
      variables: { name: labelName },
    }),
  });

  const { data: json, errors } = await data.json();
  if (errors) {
    return { props: { label: null } };
  }
  return { props: { label: json.label } };
};
