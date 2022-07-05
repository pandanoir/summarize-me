「Next.js, Prisma, Apollo GraphQL, Nexusで作るシンプルTODOアプリ」という記事を参考にしながら作っている。

https://zenn.dev/youichiro/articles/9e028d0a3b45e3

# 各ライブラリについて

* Prisma: ORM。TS でデータベースからデータを引っ張ってくることができる。
* Apollo: GraphQL クライアントとサーバーを提供する。Apollo server を立てておいて、ブラウザから API を叩くときに Apollo Client を使う。データベースからデータを引っ張ってくるときに Prisma を使っている。
* Nexus: GraphQL のスキーマをコードで生成できる。型定義も生成されるので、TS で GraphQL を書くのが各段に楽。

データベースのスキーマは Prisma が管理している。schema.prisma にモデルを定義して npx prisma migrate dev を実行することでマイグレーションできる。

GraphQL のスキーマは graphql/types ディレクトリ以下にある。npm run dev することで更新される。

