import { prisma } from '../lib/prisma';

const main = async () => {
  await prisma.challenge.createMany({
    data: [
      { title: 'サッカー' },
      { title: 'じゃんけん' },
      { title: '浦島太郎' },
      { title: 'ツイッター' },
    ],
  });
  await prisma.answer.createMany({
    data: [
      {
        content:
          'プレイヤーが複数人いて勝敗を決めるゲーム。各プレイヤーはグーチョキパーのいずれかを出す。グーはチョキに、チョキはパーに、パーはグーに勝つ。各プレイヤーが「勝ち」と「負け」に分かれなければ引き分けとなる。',
        challengeId: (
          await prisma.challenge.findFirst({ where: { title: 'じゃんけん' } })
        )?.id!,
      },
    ],
  });
  await prisma.like.createMany({
    data: [
      {
        userId: '',
        answerId: (
          await prisma.answer.findFirst({
            where: {
              content:
                'プレイヤーが複数人いて勝敗を決めるゲーム。各プレイヤーはグーチョキパーのいずれかを出す。グーはチョキに、チョキはパーに、パーはグーに勝つ。各プレイヤーが「勝ち」と「負け」に分かれなければ引き分けとなる。',
            },
          })
        )?.id!,
      },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
