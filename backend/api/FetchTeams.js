import dotenv from "dotenv";
dotenv.config();

export async function fetchTeams() {
  const res = await fetch("https://api-nba-v1.p.rapidapi.com/teams", {
    headers: {
      "rapidapi-key": process.env.RAPIDAPI_KEY,
      "rapidapi-host": process.env.RAPIDAPI_HOST,
    },
  });
  if (!res.ok) {
    throw new Error(`There was an error getting teams: ${res.statusText}`);
  }
  return res.json();
}

