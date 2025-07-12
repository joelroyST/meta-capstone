const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = router;