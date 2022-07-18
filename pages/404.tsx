import { ChakraProvider, Heading } from '@chakra-ui/react';
import { NextPage } from 'next';
import { Header } from '../src/components/Header';

const NotFoundPage: NextPage = () => (
  <ChakraProvider>
    <Header />
    <Heading>Not found</Heading>
  </ChakraProvider>
);
export default NotFoundPage;
