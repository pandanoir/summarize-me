import {
  chakra,
  Heading,
  Text,
  ChakraProvider,
  OrderedList,
  ListItem,
  VStack,
  Badge,
  Button,
  Box,
} from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

const { span: InlineText } = chakra;

const ExampleText: FC<PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => (
  <InlineText bg="blue.100" borderRadius={3} px={2}>
    {children}
  </InlineText>
);

const Challenge = () => {
  return (
    <ChakraProvider>
      <VStack p={6} as="main" spacing={4} align="stretch">
        <Heading>チュートリアル</Heading>
        <Text>
          本ページでは、要約の基本的なやり方について説明します。要約のやり方が分からない方は参考にしてください。
        </Text>
        <Text>例として「桃太郎」を要約してみましょう。</Text>
        <OrderedList>
          <ListItem>
            <Text>まず、桃太郎とは何かを書きます</Text>
          </ListItem>
          <ListItem>
            <Text>
              次に、主要人物、そのキャラクターの目的、何をする話かなどを書きます
            </Text>
            <Text>
              <Badge>Point</Badge>{' '}
              このとき、概要に不要な要素をなるべく削ってください。例:
              「鬼退治をしに鬼が島へ行く」→「鬼退治にいく」
            </Text>
          </ListItem>
        </OrderedList>
        <Text>ポイントを踏まえてできた要約がこちらになります。</Text>
        <Text fontWeight="bold">
          桃太郎は昔話である。
          桃から生まれた桃太郎が、育ててくれたおじいさんとおばあさんのために鬼退治にいく。
        </Text>
        <Box>
          <Button as="a" href="/">
            Top に戻る
          </Button>
        </Box>
      </VStack>
    </ChakraProvider>
  );
};
export default Challenge;
