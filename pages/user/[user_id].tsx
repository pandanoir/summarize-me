import {
  Heading,
  ChakraProvider,
  Spinner,
  VStack,
  Avatar,
  Icon,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { NextPage, NextPageContext } from 'next';
import { fetchInitialData } from '../../src/utils/fetchInitialData';
import { Header } from '../../src/components/Header';
import { useProfile, UserQuery } from '../../src/hooks/useProfile';
import { AiFillEdit } from 'react-icons/ai';

const Challenge: NextPage = () => {
  const { query } = useRouter();
  const userId = Array.isArray(query.user_id)
    ? query.user_id[0]
    : query.user_id || '';
  const { loading, ...profile } = useProfile(userId);

  return (
    <ChakraProvider>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        'username' in profile && (
          <VStack p={6} as="main" spacing={3} align="left">
            <VStack>
              <Avatar ignoreFallback src={profile.iconUrl} size="lg" />
              <Heading>{profile.username}</Heading>
              {profile.isMe && (
                <Button
                  leftIcon={<Icon as={AiFillEdit} />}
                  as="a"
                  href="/setting"
                >
                  プロフィールを編集する
                </Button>
              )}
            </VStack>
          </VStack>
        )
      )}
    </ChakraProvider>
  );
};
export default Challenge;

export const getServerSideProps = async ({ query }: NextPageContext) => {
  const userId = query.user_id;
  if (!userId) return { props: { initialData: null } };
  const initialData = await fetchInitialData({
    query: UserQuery,
    variables: {
      id: userId,
    },
  });

  return {
    props: initialData,
  };
};
