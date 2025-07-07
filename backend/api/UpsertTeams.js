import { PrismaClient } from "@prisma/client";
import { fetchTeams } from "./FetchTeams";
const prisma = new PrismaClient();

export async function UpsertTeams() {
  const data = await fetchTeams();
  for (const team of data.res) {
    await prisma.team.upsert({
      where: { id: team.id },
      update: {
        city: team.city || null,
        nickName: team.nickName || null,
        confName: team.confName || null,
      },
      create: {
        city: team.city || null,
        nickName: team.nickName || null,
        confName: team.confName || null,
      },
    });
  }
  console.log("Team was upserted successfully")
}

// await prisma.$disconnect()