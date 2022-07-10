import { prisma } from '../lib/prisma';

const authorId = 'auth0|5f0837623e0de80013a2485b';
const main = async () => {
  for (const title of ['浦島太郎', '桃太郎', 'かぐや姫'])
    await prisma.challenge.create({
      data: {
        title,
        authorId,
        labels: {
          connectOrCreate: ['チュートリアル', '物語', '昔話'].map((label) => ({
            where: { name: label },
            create: { name: label },
          })),
        },
      },
    });
  for (const title of ['鬼滅の刃', 'HUNTER×HUNTER', 'ドラゴンボール'])
    await prisma.challenge.create({
      data: {
        title,
        authorId,
        labels: {
          connectOrCreate: ['物語', '漫画'].map((label) => ({
            where: { name: label },
            create: { name: label },
          })),
        },
      },
    });

  await prisma.challenge.create({
    data: {
      title: 'じゃんけん',
      authorId,
      answers: {
        create: {
          content:
            'プレイヤーが複数人いて勝敗を決めるゲーム。各プレイヤーはグーチョキパーのいずれかを出す。グーはチョキに、チョキはパーに、パーはグーに勝つ。各プレイヤーが「勝ち」と「負け」に分かれなければ引き分けとなる。',
          likes: {
            create: {
              userId: '',
            },
          },
        },
      },
    },
  });
  for (const title of ['千と千尋の神隠し', 'もののけ姫', 'となりのトトロ'])
    await prisma.challenge.create({
      data: {
        title,
        authorId,
        labels: {
          connectOrCreate: ['物語', '映画', 'ジブリ'].map((label) => ({
            where: { name: label },
            create: { name: label },
          })),
        },
      },
    });

  await prisma.challenge.createMany({
    data: [
      { title: 'サッカー', authorId },
      { title: '料理', authorId },
      { title: '柔道', authorId },
      { title: 'Twitter', authorId },
      { title: 'Facebook', authorId },
      { title: 'YouTube', authorId },
      { title: 'スマートフォン', authorId },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
