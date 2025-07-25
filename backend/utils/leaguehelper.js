const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get users from a leagueId
async function getUsersFromLeagueId(leagueId) {
  const league = await prisma.league.findFirst({
    where: { leagueId },
    select: { users: true },
  });
  if (!league) return [];

  const users = await prisma.user.findMany({
    where: {
      id: { in: league.users },
    },
  });
  return users;
}

// Get fantasy teams by leagueId and userIds
async function getFantasyTeamsByLeagueAndUserIds(leagueId, userIds) {
  const fantasyTeams = await prisma.fantasyTeam.findMany({
    where: {
      leagueId,
      userId: { in: userIds },
    },
  });
  return fantasyTeams;
}

// Get refPlayers for each fantasy team
async function getPlayersFromFantasyTeam(fantasyTeams) {
  const refPlayersPromise = fantasyTeams.map(async (fantasyteam) => {
    const refplayers = await prisma.refPlayer.findMany({
      where: {
        id: { in: fantasyteam.playerIds },
      },
    });
    return { fantasyteam, refplayers };
  });
  return Promise.all(refPlayersPromise);
}

module.exports = {getUsersFromLeagueId, getFantasyTeamsByLeagueAndUserIds, getPlayersFromFantasyTeam};