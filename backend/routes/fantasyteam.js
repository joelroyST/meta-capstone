const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// To create fantasy team
router.post("/:leagueId/fantasyteam", async (req, res) => {
  try {
    const { userId, leagueId, teamName } = req.body;

    const existingTeam = await prisma.fantasyTeam.findUnique({
      where: { userId_leagueId: { userId, leagueId } },
    });

    if (existingTeam) {
      return res
        .status(400)
        .json({
          success: false,
          error: "User already in fantasy team in this league",
        });
    }

    const fantasyTeam = await prisma.fantasyTeam.create({
      data: {
        userId,
        leagueId,
        name: teamName,
        playerIds: [],
      },
    });

    return res.json({ success: true, fantasyTeam });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Not able to create fantasy team" });
  }
});

// GET the roster
router.get("/roster/:userId/:leagueId", async (req, res) => {
  const {userId, leagueId} = req.params;
  try {
    const fantasyTeam = await prisma.fantasyTeam.findUnique({
      where: {
        userId_leagueId: {
          userId: Number(userId),
          leagueId: Number(leagueId)
        }
      }
    })
    if (!fantasyTeam) {
      return res.status(404).json({players: []})
    }
    return res.json({players: fantasyTeam.playerIds || []})
  } catch (error) {
    return res.status(500).json({error: "Could not fetch roster"})
  }
})

module.exports = router;
