/*
  Warnings:

  - You are about to drop the `_LeagueToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlayerToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- DropForeignKey
ALTER TABLE "_LeagueToUser" DROP CONSTRAINT "_LeagueToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LeagueToUser" DROP CONSTRAINT "_LeagueToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerToUser" DROP CONSTRAINT "_PlayerToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerToUser" DROP CONSTRAINT "_PlayerToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_B_fkey";

-- AlterTable
ALTER TABLE "League" ADD COLUMN     "users" INTEGER[];

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "fantasyTeamId" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "players" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoritePlayers" INTEGER[],
ADD COLUMN     "favoriteTeams" TEXT[],
ADD COLUMN     "leagues" INTEGER[];

-- DropTable
DROP TABLE "_LeagueToUser";

-- DropTable
DROP TABLE "_PlayerToUser";

-- DropTable
DROP TABLE "_TeamToUser";
