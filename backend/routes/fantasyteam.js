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
      return res.status(400).json({
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
    return res
      .status(500)
      .json({ success: false, error: "Not able to create fantasy team" });
  }
});

// GET the roster
router.get("/roster/:userId/:leagueId", async (req, res) => {
  const { userId, leagueId } = req.params;
  console.log("Fetching fantasy roster for: ", { userId, leagueId });
  try {
    const fantasyTeam = await prisma.fantasyTeam.findUnique({
      where: {
        userId_leagueId: {
          userId: parseInt(userId, 10),
          leagueId: parseInt(leagueId, 10),
        },
      },
    });

    if (!fantasyTeam) {
      console.log("No fantasy team found");
      return res.status(404).json({ error: "Fantasy team not found" });
    }
    console.log("Fantasy team found: ", fantasyTeam);
    return res.json({ players: fantasyTeam.playerIds || [] });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Could not fetch roster" });
  }
});


// Add player to fantasy team
router.post("/fantasyteam/:userId/:leagueId/addPlayer", async (req, res) => {
  try {
    const { userId, leagueId } = req.params;
    const { playerId } = req.body;

    const updatedTeam = await addPlayerToFantasyTeam(userId, leagueId, playerId);
    res.json({ success: true, message: "It was a success", team: updatedTeam });
  } catch (error) {
    if (error.message === "Player already taken") {
      return res.status(400).json({ success: false, error: error.message });
    } else if (error.message === "Fantasy team not found") {
      return res.status(404).json({ success: false, error: error.message });
    }
    console.error(error);
    res.status(500).json({ success: false, error: "Couldn't add player to team" });
  }
});

module.exports = router;
