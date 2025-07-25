const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fetchPlayerStatistics() {
  const url = "https://api-nba-v1.p.rapidapi.com/players/statistics?team=32&season=2021";
  const options = {
    method: "GET",
    headers: {
      "rapidapi-key": "cbca1b28d7msh153cb400f5cac43p1467e4jsn3649d68c5aaf",
      "rapidapi-host": "api-nba-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const statsLists = data.response;
    for (const stats of statsLists) {
      const gameId = stats.game?.id ?? 0;
      const playerId = stats.player?.id ?? 0;
      if (!gameId || !playerId) {
        continue;
      }
      const gameExists = await prisma.game.findUnique({
        where: {gameId: gameId}
      });
      if (!gameExists) {
        continue;
      }
        await prisma.playerStatisticsPerGame.upsert({
            where: {playerId_gameId : {
                playerId: stats.player?.id ?? 0,
                gameId: stats.game?.id ?? 0,
            }},
            update: {
                teamId: stats.team?.id ?? 0,
                points: stats.points ?? 0,
                position: stats.pos ?? "N/A",
                minPlayed: stats.min ?? "N/A",
                fgm: stats.fgm ?? 0,
                fga: stats.fga ?? 0,
                ftm: stats.ftm ?? 0,
                fta: stats.fta ?? 0,
                ftp: stats.ftp ?? "0",
                tpm: stats.tpm ?? 0,
                tpa: stats.tpa ?? 0,
                tpp: stats.tpp ?? "0",
                offReb: stats.offReb ?? 0,
                defReb: stats.defReb ?? 0,
                totReb: stats.totReb ?? 0,
                assists: stats.assists ?? 0,
                personalFouls: stats.pFouls ?? 0,
                steals: stats.steals ?? 0,
                turnovers: stats.turnovers ?? 0,
                blocks: stats.blocks ?? 0,
                plusMinus: stats.plusMinus ?? "0",
                comment: stats.comment ?? null,
            },
            create: {
                playerId: stats.player.id,
                gameId: stats.game.id,
                teamId: stats.team?.id ?? 0,
                points: stats.points ?? 0,
                position: stats.pos ?? "N/A",
                minPlayed: stats.min ?? "N/A",
                fgm: stats.fgm ?? 0,
                fga: stats.fga ?? 0,
                ftm: stats.ftm ?? 0,
                fta: stats.fta ?? 0,
                ftp: stats.ftp ?? "0",
                tpm: stats.tpm ?? 0,
                tpa: stats.tpa ?? 0,
                tpp: stats.tpp ?? "0",
                offReb: stats.offReb ?? 0,
                defReb: stats.defReb ?? 0,
                totReb: stats.totReb ?? 0,
                assists: stats.assists ?? 0,
                personalFouls: stats.pFouls ?? 0,
                steals: stats.steals ?? 0,
                turnovers: stats.turnovers ?? 0,
                blocks: stats.blocks ?? 0,
                plusMinus: stats.plusMinus ?? "0",
                comment: stats.comment ?? null,
            }
        })
    }
  } catch (error) {
    console.error(error);
  }
}
fetchPlayerStatistics();