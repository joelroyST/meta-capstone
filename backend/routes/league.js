const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Checking if a league is created and then displaying user information
router.get("/:leagueId", async (req, res) => {
  const { leagueId } = req.params;
  try {
    const league = await prisma.league.findUnique({
      where: { leagueId: parseInt(leagueId, 10) },
      include: { users: true },
    });

    if (!league) {
      return res.status(404).json({ error: "League not found" });
    }
    return res.json({ league });
  } catch (error) {
    console.error("Error fetching league: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Assinging league information to database
router.post("/", async (req, res) => {
  const { name, userId } = req.body;

  function generateRandomId(min = 100000, max = 999999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!name || !userId) {
    console.log("POST in league.js is missing name or userId", req.body);
    return res.status(400).json({ error: "Name and userid are required" });
  }

  try {
    const newLeague = await prisma.league.create({
      data: {
        leagueId: generateRandomId(),
        name,
        users: {
          connect: { id: userId },
        },
      },
    });
    console.log("POST in league.js creating new league:", newLeague);
    return res.status(201).json({ league: newLeague });
  } catch (error) {
    console.error("POST league.js has an error creating league: ", error);
    return res.status(500).json({ error: "There is an internal server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
    const {userId} = req.params;

    try {
        const leagues = await prisma.league.findMany({
            where: {
                users: {
                    some: { id: parseInt(req.params.userId, 10)},
                }
            }
        })
        res.json(leagues);
    } catch (error) {
        res.status(500).json({error: "Internal server error in league.js"})
    }
})

module.exports = router;
