const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function executeTrade(tradeId) {
  try {
    const tradeLegs = await prisma.trade.findMany({ where: { tradeId } });
    if (!tradeLegs.length) return;

    // Ensure all trade legs are fully confirmed before executing
    const allTradesConfirmed = tradeLegs.every((leg) => leg.confirmationUser1 === 2 && leg.confirmationUser2 === 2);
    if (!allTradesConfirmed) {
      console.error(`Trade ${tradeId} not fully confirmed yet.`);
      return;
    }

    for (const {
      user1Id,
      user2Id,
      user1PlayersToGive,
      user2PlayersToGive,
      recordId,
      leagueId,
    } of tradeLegs) {
      // Fetch the fantasy teams for each user
      const [team1, team2] = await Promise.all([
        prisma.fantasyTeam.findUnique({ where: { userId: user1Id, leagueId: leagueId } }),
        prisma.fantasyTeam.findUnique({ where: { userId: user2Id, leagueId: leagueId } }),
      ]);

      if (!team1 || !team2) {
        console.error(`Fantasy team missing for trade leg ${recordId}`);
        continue;
      }

      // Remove the players user1 is giving away from team1 and adds players that user2 is giving if they're not in team1 already
      const updatedTeam1Players = team1.playerIds
        .filter((playerId) => !user1PlayersToGive.includes(playerId))
        .concat(
          user2PlayersToGive.filter((playerId) => !team1.playerIds.includes(playerId))
        );
      // Remove the players user2 is giving away from team2 and adds players that user1 is giving if they're not in team2 already
      const updatedTeam2Players = team2.playerIds
        .filter((playerId) => !user2PlayersToGive.includes(playerId))
        .concat(
          user1PlayersToGive.filter((playerId) => !team2.playerIds.includes(playerId))
        );
        
      // Update fantasy teams
      await Promise.all([
        prisma.fantasyTeam.update({
          where: {
            userId_leagueId: { userId: user1Id, leagueId: leagueId },
          },
          data: { playerIds: updatedTeam1Players },
        }),
        prisma.fantasyTeam.update({
          where: {
            userId_leagueId: { userId: user2Id, leagueId: leagueId },
          },
          data: { playerIds: updatedTeam2Players },
        }),
      ]);
    }

  } catch (error) {
    console.error(`Error executing trade ${tradeId}:`, error);
    throw error;
  }
}

module.exports = { executeTrade };
