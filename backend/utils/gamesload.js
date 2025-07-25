const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {} = require("../utils/cachehelper");
const playerStatsHelper = require("../utils/playerstatshelper").default;
const calculatePlayerValueKey = playerStatsHelper.calculatePlayerValueKey;

// async function fetchGamesData() {
//   const url = "https://api-nba-v1.p.rapidapi.com/games?season=2021&team=1";
//   const options = {
//     method: "GET",
//     headers: {
//       "rapidapi-key": "cbca1b28d7msh153cb400f5cac43p1467e4jsn3649d68c5aaf",
//       "rapidapi-host": "api-nba-v1.p.rapidapi.com",
//     },
//   };

//   try {
//     const response = await fetch(url, options);
//     const data = await response.json();
//     const games = data.response;
//     for (const game of games) {
//         await prisma.game.upsert({
//             where: {gameId: game.id},
//             update: {
//                 date: new Date(game.date.start),
//                 arena: game.arena?.name || null,
//                 city: game.arena?.city || null,
//                 state: game.arena?.state || null,
//                 homeTeamId: game.teams.home.id,
//                 awayTeamId: game.teams.visitors.id,
//                 homeTeamPoints: game.scores?.home?.points ?? 0,
//                 awayTeamPoints: game.scores?.visitors?.points ?? 0,
//                 homeTeamLogo: game.teams.home.logo ?? null,
//                 awayTeamLogo: game.teams.visitors.logo ?? null,
//             },
//             create: {
//                 gameId: game.id,
//                 date: new Date(game.date.start),
//                 arena: game.arena?.name || null,
//                 city: game.arena?.city || null,
//                 state: game.arena?.state || null,
//                 homeTeamId: game.teams.home.id,
//                 awayTeamId: game.teams.visitors.id,
//                 homeTeamPoints: game.scores?.home?.points ?? 0,
//                 awayTeamPoints: game.scores?.visitors?.points ?? 0,
//                 homeTeamLogo: game.teams.home.logo ?? null,
//                 awayTeamLogo: game.teams.visitors.logo ?? null,
//             }
//         })
//     }

//   } catch (error) {
//     console.error(error);
//   }
// }
// fetchGamesData();

// Use your existing calculatePlayerValue function here

async function populatePlayerValuesForSeason() {
  try {
    const players = await prisma.refPlayer.findMany();

    for (const player of players) {
      const stats = await prisma.playerStatisticsPerGame.findMany({
        where: { playerId: player.id },
      });

      // Transform Prisma results into your expected "games" format
      const games = stats.map(stat => ({
        playerStats: {
          position: stat.position,
          points: stat.points,
          assists: stat.assists,
          steals: stat.steals,
          blocks: stat.blocks,
          totReb: stat.totReb,
        }
      }));

      const computedValue = Math.round(calculatePlayerValueKey(games));

      // Update the RefPlayer value in the database
      await prisma.refPlayer.update({
        where: { id: player.id },
        data: { value: computedValue },
      });
    }

  } catch (error) {
    console.error("Error populating player values:", error);
  } finally {
    await prisma.$disconnect();
  }
}
populatePlayerValuesForSeason();