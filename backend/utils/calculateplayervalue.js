function calculatePlayerValue(games) {
  if (!games || games.length === 0) return 0;

  let totalValue = 0;
  let gamesCounted = 0;

  games.forEach((game) => {
    const stats = game.playerStats;
    if (!stats || !stats.position) return;

    const position = stats.position.toUpperCase();
    let weights = {};

    if (position.includes("C")) {
      weights = { points: 1, assists: 0.5, steals: 1, blocks: 3, totReb: 2 };
    } else if (position.includes("PF")) {
      weights = { points: 1, assists: 0.75, steals: 1, blocks: 2.5, totReb: 1.8 };
    } else if (position.includes("SF")) {
      weights = { points: 1, assists: 1, steals: 1.5, blocks: 1.5, totReb: 1.2 };
    } else if (position.includes("SG")) {
      weights = { points: 1.2, assists: 1.5, steals: 2, blocks: 0.8, totReb: 0.8 };
    } else if (position.includes("PG")) {
      weights = { points: 1, assists: 2.5, steals: 2, blocks: 0.5, totReb: 0.5 };
    } else {
      weights = { points: 1, assists: 1, steals: 1, blocks: 1, totReb: 1 };
    }

    let gameValue = 0;
    for (const [stat, weight] of Object.entries(weights)) {
      const statValue = parseFloat(stats[stat]);
      if (!isNaN(statValue)) {
        gameValue += statValue * weight;
      }
    }

    totalValue += gameValue;
    gamesCounted += 1;
  });

    return Math.round(totalValue / gamesCounted);
}
export default calculatePlayerValue;