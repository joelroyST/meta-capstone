const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fetchNBAPlayers() {
  const url = "https://api-nba-v1.p.rapidapi.com/players?team=32&season=2021";
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
    const players = data.response;
    for (const player of players) {
        await prisma.refPlayer.upsert({
            where: {id: player.id},
            update: {metadata: player},
            create: {
                id: player.id,
                metadata: player,
            }
        })
    }
  } catch (error) {
    console.error(error);
  }
}
fetchNBAPlayers();
