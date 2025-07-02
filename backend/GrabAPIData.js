import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function fetchTeams() {
  const res = await fetch("emptyplaceholder.com", {
    headers: {
      "rapidapi-key": process.env.RAPIDAPI_KEY,
      "rapidapi-host": "examplehost.com",
    },
  });
  if (!res.ok)
    throw new Error(`There was an error getting teams: ${res.statusText}`);
  return res.json();
}

async function fetchPlayers() {
  const res = await fetch("emptyplaceholder.com", {
    headers: {
      "rapidapi-key": process.env.RAPIDAPI_KEY,
      "rapidapi-host": "examplehost.com",
    },
  });
  if (!res.ok)
    throw new Error(`There was an error getting players: ${res.statusText}`);
  return res.json();
}

async function insertTeams() {
  const data = await fetchTeams();
  for (const team of data.res) {
    await prisma.team.upsert({
      where: { id: team.id },
      update: {
        city: team.city || "Not provided",
        nickName: team.nickName || "Not provided",
        confName: team.confName || "Not provided",
      },
      create: {
        city: team.city || "Not provided",
        nickName: team.nickName || "Not provided",
        confName: team.confName || "Not provided",
      },
    });
  }
}

async function insertPlayers() {
  const data = await fetchPlayers();
  for (const player of data.res) {
    await prisma.player.upsert({
      where: { playerId: player.id },
      update: {
        firstName: player.firstName || "Not provided",
        lastName: player.lastName || "Not provided",
        teamId: player.team.id || "Not provided",
        value: 0,
      },
      create: {
        playerId: player.id,
        firstName: player.firstName || "Not provided",
        lastName: player.lastName || "Not provided",
        teamId: player.team.id || "Not provided",
        value: 0,
      },
    });
  }
}

async function main() {
  await insertTeams();
  await insertPlayers();
  console.log("Completed inputting data into database")
  process.exit(1);
}

main();
