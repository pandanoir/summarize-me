import { useMutation } from '@apollo/client';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  Avatar,
  ChakraProvider,
  FormLabel,
  Heading,
  HStack,
  Text,
  Input,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { gql } from 'apollo-server-micro';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
} from '../generated/nexus-typegen';
import { UserMenu } from '../src/components/UserMenu';
import { fetchData } from '../src/utils/fetchInitialData';

const updateProfileMutation = gql`
  mutation UpdateProfile($newIcon: Upload, $username: String!) {
    updateProfile(newIcon: $newIcon, username: $username) {
      id
    }
  }
`;
type Props = {
  profile: NexusGenFieldTypes['User'];
};
const Setting: NextPage<Props> = ({ profile }) => {
  const [usernameValue, setUsernameValue] = useState(profile.username);
  const [previewSrc, setPreviewSrc] = useState(profile.iconUrl);
  const [fileValue, setFileValue] = useState<File | null>(null);
  const resetFileInput = () => {
    setFileValue(null);
    setPreviewSrc(profile.iconUrl);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateProfile] = useMutation<
    NexusGenFieldTypes['Mutation']['updateProfile'],
    NexusGenArgTypes['Mutation']['updateProfile']
  >(updateProfileMutation);
  const toast = useToast();
  return (
    <ChakraProvider>
      <Head>
        <title>summarize me</title>
      </Head>
      <VStack p={6} as="main" spacing={12} align="left">
        <HStack justify="space-between">
          <Heading>Setting</Heading>
          <UserMenu iconUrl={profile.iconUrl} />
        </HStack>

        <HStack align="left">
          <VStack as={FormLabel}>
            <Avatar src={previewSrc} size="lg" />
            <Text>変更する</Text>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const { files } = e.target;
                if (!files || files.length === 0) {
                  resetFileInput();
                  return;
                }

                setFileValue(files[0]);
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string')
                    setPreviewSrc(reader.result);
                };

                reader.readAsDataURL(files[0]);
              }}
            />
          </VStack>
          <VStack align="left">
            <FormLabel>
              ユーザー名:
              <Input
                required
                value={usernameValue}
                onChange={({ target: { value } }) => setUsernameValue(value)}
              />
            </FormLabel>
            <Button
              colorScheme="blue"
              w="max"
              onClick={() => {
                console.log(fileValue);
                updateProfile({
                  variables: { newIcon: fileValue, username: usernameValue },
                  onCompleted: () => {
                    toast({
                      title: '設定を更新できました',
                      position: 'bottom-right',
                    });
                  },
                });
              }}
            >
              更新する
            </Button>
          </VStack>
        </HStack>
      </VStack>
    </ChakraProvider>
  );
};

export default Setting;

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
