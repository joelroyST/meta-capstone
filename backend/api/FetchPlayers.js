import dotenv from "dotenv";
dotenv.config();

export async function fetchPlayers() {
  const res = await fetch("emptyplaceholder.com", {
    headers: {
      "rapidapi-key": process.env.RAPIDAPI_KEY,
      "rapidapi-host": "examplehost.com",
    },
  });
  if (!res.ok) {
    throw new Error(`There was an error getting players: ${res.statusText}`);
  }
  return res.json();
}
