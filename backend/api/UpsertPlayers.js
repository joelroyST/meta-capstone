import { fetchPlayers } from "./FetchPlayers";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function UpsertPlayers() {
  const data = await fetchPlayers();
  for (const player of data.res) {
    await prisma.player.upsert({
      where: { playerId: player.id },
      update: {
        firstName: player.firstName || null,
        lastName: player.lastName || null,
        teamId: player.team.id || null,
        value: 0,
      },
      create: {
        playerId: player.id,
        firstName: player.firstName || null,
        lastName: player.lastName || null,
        teamId: player.team.id || null,
        value: 0,
      },
    });
  }
}
console.log("Player was upserted successfully");
await prisma.$disconnect();
