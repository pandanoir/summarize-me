import {
  chakra,
  Heading,
  Text,
  ChakraProvider,
  OrderedList,
  ListItem,
  VStack,
  Button,
  Box,
} from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

const { span: InlineText } = chakra;

const Challenge = () => {
  return (
    <ChakraProvider>
      <VStack p={6} as="main" spacing={12} align="stretch">
        <VStack spacing={4} align="stretch">
          <Heading>チュートリアル</Heading>
          <Text>要約の基本的なやり方について説明します。</Text>
          <Text>
            要約は
            <Text as="mark" px="1" py="1" bg="orange.100">
              それが何であるか
            </Text>
            、
            <Text as="mark" px="1" py="1" bg="green.100">
              詳しい説明
            </Text>
            という順が基本形です。
          </Text>
          <Text>例として「桃太郎」を要約してみましょう。</Text>
          <OrderedList spacing="3">
            <ListItem>
              まず、
              <Text as="mark" px="1" py="1" bg="orange.100">
                「桃太郎」とは何か
              </Text>
              を書きます
            </ListItem>
            <ListItem>
              次に
              <Text as="mark" px="1" py="1" bg="green.100">
                主要人物、そのキャラクターの目的、何をする話か
              </Text>
              を書きます
            </ListItem>
          </OrderedList>
          <Text>ポイントを踏まえてできた要約がこちらになります。</Text>
          <Text fontWeight="bold">
            <Text as="mark" px="1" py="1" bg="orange.100" mr="1">
              桃太郎は昔話である。
            </Text>
            <Text as="mark" px="1" py="1" bg="green.100">
              桃から生まれた桃太郎が、育ててくれたおじいさんとおばあさんのために鬼退治にいく。
            </Text>
          </Text>
        </VStack>
        <VStack spacing={4} align="stretch">
          <Heading size="lg">ワンポイントアドバイス</Heading>
          <Text>不要な要素はなるべく削ってください</Text>
          <Text>
            例: 「鬼退治
            <Text as="mark" px="1" py="1" bg="red.100">
              をしに鬼が島へ
            </Text>
            行く」→「鬼退治にいく」
          </Text>
          <Box>
            <Button as="a" href="/">
              Top に戻る
            </Button>
          </Box>
        </VStack>
      </VStack>
    </ChakraProvider>
  );
};
export default Challenge;
