/*
  Warnings:

  - Made the column `challengeId` on table `Answer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_challengeId_fkey";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "challengeId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
