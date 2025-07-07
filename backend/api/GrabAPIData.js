import { UpsertPlayers } from "./UpsertPlayers";
import { UpsertTeams } from "./UpsertTeams";

async function main() {
  console.log("Code is working on GRABAPIDATA");
  await UpsertTeams();
  await UpsertPlayers();
  console.log("Completed inputting data into database")
  process.exit(0);
}

main();
