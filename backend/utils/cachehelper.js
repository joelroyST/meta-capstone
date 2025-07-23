const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getCachedPlayerWindow(playerId, windowStart, windowEnd) {
  return await prisma.playerWindowCache.findUnique({
    where: {
      playerId_windowStart_windowEnd: {
        playerId,
        windowStart,
        windowEnd,
      },
    },
  });
}

async function setCachedPlayerWindow(playerId, windowStart, windowEnd, gamesWithStats, playerAverages) {
  return await prisma.playerWindowCache.upsert({
    where: {
      playerId_windowStart_windowEnd: {
        playerId,
        windowStart,
        windowEnd,
      },
    },
    update: {}, // We don't need to update so do nothing (static data)
    create: {
      playerId,
      windowStart,
      windowEnd,
      gamesWithStats,
      playerAverages,
    },
  });
}

module.exports = {getCachedPlayerWindow, setCachedPlayerWindow};
