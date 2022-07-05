/*
  Warnings:

  - A unique constraint covering the columns `[userId,answerId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_answerId_key" ON "Like"("userId", "answerId");
