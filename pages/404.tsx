import { ChakraProvider, Heading } from '@chakra-ui/react';
import { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  return (
    <ChakraProvider>
      <Heading>Not found</Heading>
    </ChakraProvider>
  );
};
export default NotFoundPage;
