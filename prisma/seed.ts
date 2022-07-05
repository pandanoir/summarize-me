import { prisma } from '../lib/prisma';

const main = async () => {
  for (const title of ['浦島太郎', '桃太郎', 'かぐや姫'])
    await prisma.challenge.create({
      data: {
        title,
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
  await prisma.challenge.createMany({
    data: [
      { title: 'サッカー' },
      { title: 'Twitter' },
      { title: 'Facebook' },
      { title: 'YouTube' },
      { title: 'スマートフォン' },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
