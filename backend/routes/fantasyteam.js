const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { addPlayerToFantasyTeam, removePlayerFromFantasyTeam}  = require("../utils/fantasyteamhelper");

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

// GET a user's fantasy team in a league
router.get("/:userId/:leagueId", async (req, res) => {
  const { userId, leagueId } = req.params;

  try {
    const team = await prisma.fantasyTeam.findUnique({
      where: {
        userId_leagueId: {
          userId: parseInt(userId, 10),
          leagueId: parseInt(leagueId, 10),
        },
      },
    });

    if (!team) {
      return res.status(404).json({ error: "Fantasy team not found" });
    }

    return res.json({ players: team.playerIds }); // Make sure this matches frontend expectations
  } catch (error) {
    console.error("Error fetching fantasy team:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Add player to fantasy team
router.post("/:userId/:leagueId/addPlayer", async (req, res) => {
  try {
    const { userId, leagueId } = req.params;
    const { playerId } = req.body;

    const updatedTeam = await addPlayerToFantasyTeam(userId, leagueId, playerId);
    res.json({ success: true, message: "It was a success", team: updatedTeam });
  } catch (error) {
    if (error.message === "Player already taken") {
      return res.status(400).json({ success: false, error: error.message });
    } else if (error.message === "Fantasy team not found") {
      return res.status(404).json({ success: false, error: error.message, message: "Error found in fantasyteam.js" });
    }
    console.error(error);
    res.status(500).json({ success: false, error: "Couldn't add player to team" });
  }
});

// Remove player from fantasy team
router.post("/:userId/:leagueId/removePlayer", async (req, res) => {
  try {
    const { userId, leagueId } = req.params;
    const { playerId } = req.body;

    const updatedTeam = await removePlayerFromFantasyTeam(userId, leagueId, playerId)
    res.json({success: true, message: "Player removed successfully", team: updatedTeam})
  } catch (error) {
    if (error.message === "Fantasy team not found") {
      return res.status(404).json({success: false, error: error.message})
    }
    console.error(error);
    res.status(500).json({success: false, error: "Couldn't remove player from team"})
  }
})

module.exports = router;
