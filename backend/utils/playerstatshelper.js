function calculatePlayerValue(games) {
  if (!games || games.length === 0) return 0;
  const weightsMap = {
    "C": [1, 0.5, 1, 3, 2],
    "PF": [1, 0.75, 1, 2.5, 1.8],
    "SF": [1, 1, 1.5, 1.5, 1.2],
    "SG": [1.2, 1.5, 2, 0.8, 0.8],
    "PG": [1, 2.5, 2, 0.5, 0.5]
  }
  const defaultWeights = [1, 1, 1, 1, 1] // If the player doesn't have a position specified

  const statKeys = ["points", "assists", "steals", "blocks", "totReb"]
  let totalValue = 0;
  let gamesCounted = 0;

  games.forEach((game) => {
    const stats = game.playerStats;
    if (!stats || !stats.position) return;

    const position = stats.position.toUpperCase();
    let weights = null;

    for (const pos of Object.keys(weightsMap)) {
      if (position.includes(pos)) {
        weights = weightsMap[pos]
      }
    }

    if (!weights) {
      weights = defaultWeights;
    }

    let gameValue = 0;
    for (let i = 0; i < statKeys.length; i++) {
      const stat = statKeys[i];
      const weight = weights[i];
      const statValue = parseFloat(stats[stat]);
      if (!isNaN(statValue)) {
        gameValue += statValue * weight;
      }
    }

    totalValue += gameValue;
    gamesCounted += 1;
  });

    return totalValue / gamesCounted;
}

function computePlayerAverages(gamesWithStats) {
  const statKeys = [
    "points",
    "position",
    "minPlayed",
    "fgm",
    "fga",
    "ftm",
    "fta",
    "ftp",
    "tpm",
    "tpa",
    "tpp",
    "offReb",
    "defReb",
    "totReb",
    "assists",
    "personalFouls",
    "steals",
    "turnovers",
    "blocks",
    "plusMinus",
    "comment",
  ]

  const playerAverages = {};

  if (gamesWithStats.length === 0) return playerAverages;

  statKeys.forEach((key) => {
    const total = gamesWithStats.reduce((sum, game) => {
      const value = parseFloat(game.playerStats?.[key]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    playerAverages[key] = (total / gamesWithStats.length).toFixed(2);
  });

  return playerAverages;
}

function computePlayerAveragesFromGames(playerGames) {
  if (!playerGames || playerGames.length === 0) {
    return {
      avgPoints: "0.00",
      avgRebounds: "0.00",
      avgAssists: "0.00",
    };
  }

  const totals = playerGames.reduce(
    (accumulator, game) => {
      accumulator.points += game.points || 0;
      accumulator.rebounds += game.totReb || 0;
      accumulator.assists += game.assists || 0;
      return accumulator;
    },
    { points: 0, rebounds: 0, assists: 0 }
  );

  const numGames = playerGames.length;

  return {
    avgPoints: (totals.points / numGames).toFixed(2),
    avgRebounds: (totals.rebounds / numGames).toFixed(2),
    avgAssists: (totals.assists / numGames).toFixed(2),
  };
}

export default {calculatePlayerValueKey: calculatePlayerValue, computePlayerAveragesKey: computePlayerAverages, computePlayerAveragesFromGamesKey: computePlayerAveragesFromGames};