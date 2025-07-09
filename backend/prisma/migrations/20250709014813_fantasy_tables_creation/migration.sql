/*
  Warnings:

  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Player` table. All the data in the column will be lost.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teamId` on the `Team` table. All the data in the column will be lost.
  - The primary key for the `_TeamToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_PlayerToTeam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PlayerToTeam" DROP CONSTRAINT "_PlayerToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerToTeam" DROP CONSTRAINT "_PlayerToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerToUser" DROP CONSTRAINT "_PlayerToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_A_fkey";

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "id",
ADD COLUMN     "value" INTEGER NOT NULL,
ALTER COLUMN "teamId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("playerId");

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "teamId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Team_id_seq";

-- AlterTable
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_TeamToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropTable
DROP TABLE "_PlayerToTeam";

-- CreateTable
CREATE TABLE "League" (
    "leagueId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("leagueId")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "playersFromTeamA" INTEGER[],
    "playersFromTeamB" INTEGER[],
    "userA" INTEGER NOT NULL,
    "leagueA" INTEGER NOT NULL,
    "userB" INTEGER NOT NULL,
    "leagueB" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FantasyTeam" (
    "userId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "playerIds" INTEGER[],

    CONSTRAINT "FantasyTeam_pkey" PRIMARY KEY ("userId","leagueId")
);

-- CreateTable
CREATE TABLE "_LeagueToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LeagueToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LeagueToUser_B_index" ON "_LeagueToUser"("B");

-- AddForeignKey
ALTER TABLE "PlayerStatisticsPerGame" ADD CONSTRAINT "PlayerStatisticsPerGame_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToUser" ADD CONSTRAINT "_LeagueToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "League"("leagueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToUser" ADD CONSTRAINT "_LeagueToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToUser" ADD CONSTRAINT "_PlayerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("playerId") ON DELETE CASCADE ON UPDATE CASCADE;
