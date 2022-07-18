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
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Header } from '../../src/components/Header';
import { useCreateChallenge } from '../../src/hooks/useChallenge';

const ChallengeCreatePage: NextPage = () => {
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
      <Header />
      <VStack p={6} as="main" spacing={12} align="left">
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

export const getServerSideProps = withPageAuthRequired();
