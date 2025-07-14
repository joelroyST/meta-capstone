const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function isPlayerInAFantasyTeam(playerId, leagueId) {
  const teamsInLeague = await prisma.fantasyTeam.findMany({
    where: { leagueId },
    select: { playerIds: true, userId: true },
  });

  for (const team of teamsInLeague) {
    if (team.playerIds.includes(playerId)) {
      console.log(`Player ${playerId} is already owned by user ${team.userId} in league ${leagueId}.`);
      return true;
    }
  }

  console.log(`Player ${playerId} is free in league ${leagueId}.`);
  return false;
}

async function addPlayerToFantasyTeam(userId, leagueId, playerId) {
  const parsedUserId = parseInt(userId, 10);
  const parsedLeagueId = parseInt(leagueId, 10);

  const playerTaken = await isPlayerInAFantasyTeam(playerId, parsedLeagueId);
  if (playerTaken) {
    throw new Error("Player already taken");
  }

  const fantasyTeam = await prisma.fantasyTeam.findUnique({
    where: {
      userId_leagueId: {
        userId: parsedUserId,
        leagueId: parsedLeagueId,
      }
    }
  });

  if (!fantasyTeam) {
    throw new Error("Fantasy team not found");
  }

  const updatedTeam = await prisma.fantasyTeam.update({
    where: {
      userId_leagueId: {
        userId: parsedUserId,
        leagueId: parsedLeagueId,
      }
    },
    data: {
      playerIds: {
        push: playerId,
      }
    }
  });

  return updatedTeam;
}

module.exports = addPlayerToFantasyTeam;