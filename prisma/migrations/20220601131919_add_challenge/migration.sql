-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(280) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "challengeId" INTEGER,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
