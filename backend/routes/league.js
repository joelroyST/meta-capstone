const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { createFantasyTeam } = require("../utils/fantasyteamhelper");

// Checking if a league is created and then displaying user information
router.get("/:leagueId", async (req, res) => {
  const { leagueId } = req.params;
  try {
    const league = await prisma.league.findUnique({
      where: { leagueId: parseInt(leagueId, 10) },
    });

    const userIds = league?.users || [];
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return res.json({ league: { ...league, users } });
  } catch (error) {
    console.error("Error fetching league: ", error);
    return res.status(404).json({ error: "Internal server error...." });
  }
});

// Assinging league information to database
router.post("/", async (req, res) => {
  const { name, userId } = req.body;

  function generateRandomId(min = 100000, max = 999999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!name || !userId) {
    return res.status(400).json({ error: "Name and userId are required" });
  }

  try {
    const newLeague = await prisma.league.create({
      data: {
        leagueId: generateRandomId(),
        name,
        users: [userId],
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        leagues: {
          push: newLeague.leagueId,
        },
      },
    });

    createFantasyTeam(userId, newLeague.leagueId);

    return res.status(201).json({ league: newLeague });
  } catch (error) {
    console.error("POST league.js has an error creating league: ", error);
    return res.status(500).json({ error: "There is an internal server error" });
  }
});

// Get all the leagues of the specified user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const leagues = await prisma.league.findMany({
      where: {
        users: {
          has: userIdNum,
        },
      },
    });
    res.json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error in league.js" });
  }
});

// Get all the users in a specified league
router.get("/:leagueId/users", async (req, res) => {
  const { leagueId } = req.params;

  try {
    const leagueIdNum = parseInt(leagueId, 10);
    if (isNaN(leagueIdNum)) {
      return res.status(400).json({ error: "Invalid leagueId" });
    }

    const users = await prisma.user.findMany({
      where: {
        leagues: {
          has: leagueIdNum,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error in league.js for getting league users",
    });
  }
});

router.get("/:leagueId/users-with-players", async (req, res) => {
  const { leagueId } = req.params;

  try {
    const leagueIdNum = parseInt(leagueId, 10);
    if (isNaN(leagueIdNum)) {
      return res.status(400).json({ error: "Invalid leagueId" });
    }

    const userIds = await prisma.league.findFirst({
      where: {
        leagueId: leagueIdNum,
      },
      select: {
        users: true,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds.users,
        }
      }
    })

    const fantasyteams = await prisma.fantasyTeam.findMany({
      where: {
        leagueId: {
          equals: leagueIdNum,
        },
        userId: {
          in: userIds.users,
        }
      }
    })

    const refplayerspromise = fantasyteams.map(async (fantasyteam) => {
      const refplayers = await prisma.refPlayer.findMany({
        where: {
          id: {
            in: fantasyteam.playerIds,
          },
        },
      });
      return {fantasyteam, refplayers}
    });

    const result1 = await Promise.all(refplayerspromise)
    return res.json({users, result1});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error in league.js for getting users from league",
    });
  }
});

// Allow user to join an existing league
router.post("/:leagueId/join", async (req, res) => {
  const {leagueId} = req.params;
  const {userId} = req.body;

  if(!userId) {
    return res.status(400).json({error: "userId is required"})
  }

  try {
    const leagueIdNum = parseInt(leagueId, 10);

    const updatedLeague = await prisma.league.update({
      where: {leagueId: leagueIdNum},
      data: {
        users: {
          push: userId,
        }
      }
    })

    await prisma.user.update({
      where: {id: userId},
      data: {
        leagues: {
          push: leagueIdNum
        }
      }
    })

    const createdFantasyTeam = await createFantasyTeam(userId, leagueIdNum)

    res.status(200).json({message: "User successfully joined the league", league: updatedLeague, fantasyTeam: createdFantasyTeam})
  } catch (error) {
    console.error("Error joining league: ", error)
    res.status(500).json({error: "Internal server error while joining league"})
  }
})

module.exports = router;
