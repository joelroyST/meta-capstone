const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET the players from refPlayers for the marketplace
router.get("/refPlayers", async (req, res) => {
  try {
    const players = await prisma.refPlayer.findMany();
    return res.json(players);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.post("/players", async (req, res) => {
  try {
    const { id, firstName, lastName } = req.body;

    const existingPlayer = await prisma.player.findUnique({
      where: { playerId: id },
    });

    if (existingPlayer) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Player already in database",
        });
    }
    const fullName = `${firstName} ${lastName}`
    const player = await prisma.player.create({
      data: {
        id,
        firstName,
        lastName,
        name: fullName,
        playerIds: [],
        value: 0,
      },
    });

    return res.json({ success: true, player });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Not able to create player" });
  }
});

// Fetch random refPlayers with their games
router.get("/randomRefPlayersWithAverages", async (req, res) => {
  const numberPlayers = 15;
  try {
    const allRefPlayers = await prisma.refPlayer.findMany({
      select: { id: true, metadata: true },
    });

    if (allRefPlayers.length === 0) return res.json([]);

    const shuffled = allRefPlayers.sort(() => 0.5 - Math.random());
    const selectedPlayers = shuffled.slice(0, numberPlayers);

    const playerData = await Promise.all(
      selectedPlayers.map(async (refPlayer) => {
        const metadata = refPlayer.metadata;
        const playerId = metadata.id;
        const firstName = metadata.firstname || "N/A";
        const lastName = metadata.lastname || "N/A";
        const position = metadata.leagues?.standard?.pos || "N/A";
        const teamId = metadata.teamId || null;

        const games = await prisma.playerStatisticsPerGame.findMany({
          where: { playerId: playerId },
        });

        let ppg = 0;
        if (games.length > 0) {
          const totalPoints = games.reduce((sum, game) => sum + (game.points || 0), 0);
          ppg = totalPoints / games.length;
        }

        return {playerId, firstName, lastName, position, teamId, ppg: ppg.toFixed(2),games};
      })
    );

    const sortedByPPG = playerData.sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg));

    return res.json(sortedByPPG);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch random refPlayers with averages" });
  }
});
module.exports = router;