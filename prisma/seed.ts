import { prisma } from '../lib/prisma';

const main = async () => {
  await prisma.challenge.createMany({
    data: [
      { title: 'サッカー' },
      { title: 'じゃんけん' },
      { title: '浦島太郎' },
      { title: '桃太郎' },
      { title: 'かぐや姫' },
      { title: '鬼滅の刃' },
      { title: 'HUNTER×HUNTER' },
      { title: 'ドラゴンボール' },
      { title: 'Twitter' },
      { title: 'Facebook' },
      { title: 'YouTube' },
      { title: 'スマートフォン' },
    ],
  });
  await prisma.answer.createMany({
    data: [
      {
        content:
          'プレイヤーが複数人いて勝敗を決めるゲーム。各プレイヤーはグーチョキパーのいずれかを出す。グーはチョキに、チョキはパーに、パーはグーに勝つ。各プレイヤーが「勝ち」と「負け」に分かれなければ引き分けとなる。',
        challengeId: (await prisma.challenge.findFirst({
          where: { title: 'じゃんけん' },
        }))!.id,
      },
    ],
  });
  await prisma.like.createMany({
    data: [
      {
        userId: '',
        answerId: (await prisma.answer.findFirst({
          where: {
            content:
              'プレイヤーが複数人いて勝敗を決めるゲーム。各プレイヤーはグーチョキパーのいずれかを出す。グーはチョキに、チョキはパーに、パーはグーに勝つ。各プレイヤーが「勝ち」と「負け」に分かれなければ引き分けとなる。',
          },
        }))!.id,
      },
    ],
  });

  await prisma.label.createMany({
    data: [
      ...[
        (await prisma.challenge.findFirst({ where: { title: '浦島太郎' } }))!,
        (await prisma.challenge.findFirst({ where: { title: 'かぐや姫' } }))!,
        (await prisma.challenge.findFirst({ where: { title: '桃太郎' } }))!,
      ].flatMap(({ id }) => [
        { challengeId: id, name: 'チュートリアル' },
        { challengeId: id, name: '物語' },
        { challengeId: id, name: '昔話' },
      ]),
      ...[
        (await prisma.challenge.findFirst({
          where: { title: 'ドラゴンボール' },
        }))!,
        (await prisma.challenge.findFirst({
          where: { title: 'HUNTER×HUNTER' },
        }))!,
        (await prisma.challenge.findFirst({ where: { title: '鬼滅の刃' } }))!,
      ].flatMap(({ id }) => [
        { challengeId: id, name: '物語' },
        { challengeId: id, name: '漫画' },
      ]),
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
