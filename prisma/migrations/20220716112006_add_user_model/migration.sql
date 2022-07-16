-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

INSERT INTO "User" ("id")
SELECT DISTINCT "authorId" FROM "Challenge" WHERE "authorId" != ''
UNION
SELECT DISTINCT "authorId" FROM "Answer" WHERE "authorId" != ''
UNION
SELECT DISTINCT "userId" FROM "Like" WHERE "userId" != '';

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
