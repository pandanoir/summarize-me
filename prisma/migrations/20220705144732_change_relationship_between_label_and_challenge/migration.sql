/*
  Warnings:

  - You are about to drop the column `challengeId` on the `Label` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_challengeId_fkey";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "challengeId";

-- CreateTable
CREATE TABLE "_ChallengeToLabel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeToLabel_AB_unique" ON "_ChallengeToLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeToLabel_B_index" ON "_ChallengeToLabel"("B");

-- AddForeignKey
ALTER TABLE "_ChallengeToLabel" ADD CONSTRAINT "_ChallengeToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeToLabel" ADD CONSTRAINT "_ChallengeToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
