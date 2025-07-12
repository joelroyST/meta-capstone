-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerStatisticsPerGame" DROP CONSTRAINT "PlayerStatisticsPerGame_playerId_fkey";

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "teamId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RefPlayer" (
    "id" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "RefPlayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
