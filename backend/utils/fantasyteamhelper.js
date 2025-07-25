const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function isPlayerInAFantasyTeam(playerId, leagueId) {
  const teamsInLeague = await prisma.fantasyTeam.findMany({
    where: { leagueId },
    select: { playerIds: true, userId: true },
  });

  for (const team of teamsInLeague) {
    if (team.playerIds.includes(playerId)) {
      console.error(
        `Player ${playerId} is already owned by user ${team.userId} in league ${leagueId}.`
      );
      return true;
    }
  }

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
      },
    },
  });

  if (!fantasyTeam) {
    throw new Error("Fantasy team not found");
  }

  const updatedTeam = await prisma.fantasyTeam.update({
    where: {
      userId_leagueId: {
        userId: parsedUserId,
        leagueId: parsedLeagueId,
      },
    },
    data: {
      playerIds: {
        push: playerId,
      },
    },
  });

  return updatedTeam;
}

async function removePlayerFromFantasyTeam(userId, leagueId, playerId) {
  const parsedUserId = parseInt(userId, 10);
  const parsedLeagueId = parseInt(leagueId, 10);
  const parsedPlayerId = parseInt(playerId, 10);

  const fantasyTeam = await prisma.fantasyTeam.findUnique({
    where: {
        userId_leagueId: {
            userId: parsedUserId,
            leagueId: parsedLeagueId,
        }
    }
  })
  if (!fantasyTeam) {
    throw new Error("Fantasy team not found");
  }

  const updatedPlayerIds = fantasyTeam.playerIds.filter(id => id !== parsedPlayerId);

  const updatedTeam = await prisma.fantasyTeam.update({
    where: {
        userId_leagueId: {
            userId: parsedUserId,
            leagueId: parsedLeagueId,
        }
    },
    data: {
        playerIds: updatedPlayerIds,
    }
  })
  return updatedTeam;
}

async function createFantasyTeam(userId, leagueId) {
  const existingTeam = await prisma.fantasyTeam.findUnique({
    where: { userId_leagueId: { userId, leagueId } },
  });

  if (existingTeam) {
    throw new Error("User already has a fantasy team in this league");
  }

  const fantasyTeam = await prisma.fantasyTeam.create({
    data: {
      userId,
      leagueId,
      name: "My team",
      playerIds: [],
    },
  });
}

module.exports = {addPlayerToFantasyTeam, removePlayerFromFantasyTeam, createFantasyTeam};