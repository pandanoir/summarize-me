import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  Button,
  ChakraProvider,
  Heading,
  HStack,
  Input,
  VStack,
  Tag,
  FormLabel,
  IconButton,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { gql } from 'apollo-server-micro';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../../generated/nexus-typegen';
import { UserMenu } from '../../src/components/UserMenu';
import { useCreateChallenge } from '../../src/hooks/useChallenge';
import { fetchData } from '../../src/utils/fetchInitialData';

const ChallengeCreatePage: NextPage<{
  profile: NexusGenFieldTypes['User'];
}> = ({ profile }) => {
  const [titleValue, setTitleValue] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const toast = useToast();
  const createChallenge = useCreateChallenge();

  return (
    <ChakraProvider>
      <Head>
        <title>summarize me</title>
      </Head>
      <VStack p={6} as="main" spacing={12} align="left">
        <HStack justify="space-between">
          <Heading>summarize me</Heading>
          <UserMenu iconUrl={profile.iconUrl} />
        </HStack>
        <Heading size="lg">問題を作る</Heading>
        <VStack align="left">
          <FormLabel>
            タイトル{' '}
            <Input
              required
              value={titleValue}
              onChange={({ target: { value } }) => setTitleValue(value)}
            />
          </FormLabel>
          <FormLabel>
            ラベル
            <Input
              value={labelValue}
              onChange={({ target: { value } }) => setLabelValue(value)}
              onKeyDown={({ key }) => {
                if (key !== 'Enter') {
                  return;
                }
                if (labels.includes(labelValue)) {
                  toast({
                    title: '同じラベルがあります',
                    status: 'warning',
                    position: 'bottom-right',
                  });
                  return;
                }
                setLabels((labels) => [...labels, labelValue]);
                setLabelValue('');
              }}
            />
          </FormLabel>
          <HStack spacing="4">
            {labels.map((label) => (
              <Tag variant="outline" key={label} pr="0" alignItems="center">
                {label}
                <IconButton
                  variant="unstyled"
                  display="flex"
                  size="xs"
                  icon={<Icon as={FaTimes} />}
                  aria-label="remove label"
                  onClick={() => {
                    setLabels((labels) => labels.filter((x) => x !== label));
                  }}
                />
              </Tag>
            ))}
          </HStack>
          <Button
            colorScheme="blue"
            w="max"
            onClick={() => {
              createChallenge({
                variables: { title: titleValue, labels },
                onCompleted: ({ createChallenge: { id } }) => {
                  location.href = `/challenge/${id}`;
                },
              });
            }}
          >
            作成
          </Button>
        </VStack>
      </VStack>
    </ChakraProvider>
  );
};
export default ChallengeCreatePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authResult = await withPageAuthRequired()(ctx);
  if (!('props' in authResult)) {
    return authResult;
  }
  const sub = (await authResult.props).user?.sub;
  if (!sub) {
    throw new Error('Unexpected error');
  }
  const profile = (
    await fetchData<
      { user: NexusGenFieldTypes['User'] },
      NexusGenArgTypes['Query']['user']
    >({
      query: gql`
        query User($id: ID!) {
          user(id: $id) {
            username
            iconUrl
          }
        }
      `,
      variables: { id: sub },
    })
  ).user;
  return {
    props: {
      ...authResult.props,
      profile,
    },
  };
};
