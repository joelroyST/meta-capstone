const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {transformPlayerStatisticsToGameWithStats} = require("../utils/transformplayerstatistics");
const { getCachedPlayerWindow, setCachedPlayerWindow} = require("../utils/cachehelper")
const playerStatsHelper = require("../utils/playerstatshelper").default;
const computePlayerAverages = playerStatsHelper.computePlayerAveragesKey;

router.post("/subscription/create-subscription", async (req, res) => {
  try {
    const { userId, playerId, summaryFrequencyWeeks, startDate, endDate } = req.body;

    const seasonStart = new Date("2021-10-19");
    const seasonEnd = new Date("2022-04-10");
    const start = new Date(startDate);
    const end = new Date(endDate);

    const newSubscription = await prisma.subscription.create({
      data: {
        userId,
        playerId,
        startDate: start,
        endDate: end,
        updateFrequency: summaryFrequencyWeeks,
      },
    });

    res.status(201).json(newSubscription);
  } catch (error) {
    console.error("Error creating subscriptions: ", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// Get all subscriptions for a user
router.get("/subscription/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {userId},
            orderBy: {startDate: "desc"},
        })
        res.json(subscriptions)
    } catch (error) {
        console.error("Error fetching subscriptions for the user: ", error)
        res.status(500).json({error: "Failed to fetch subscriptions subscription.js"})
    }
})

// Delete a subscription
router.delete("/subscription/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.subscription.delete({
            where: {id},
        })
    } catch (error) {
        console.error("Error deleting the subscription: ", error);
        res.status(500).json({message: "Failed to delete subscription"})
    }
})

// Get all games and player stats for a subcription and group them into a window
router.get("/subscription/:subscriptionId/summary", async (req, res) => {
    const subscriptionId = parseInt(req.params.subscriptionId);

    try {
        const subscription = await prisma.subscription.findUnique({
            where: {id: subscriptionId}
        })

        if (!subscription) {
            return res.status(404).json({message: "Subscription not found"})
        }

        const {playerId, startDate, endDate, updateFrequency} = subscription;

        const subscriptionStart = new Date(startDate)
        const subscriptionEnd = new Date(endDate)
        const updateWindowInDays = updateFrequency;
        const statisticsPerWindows = [];

        let windowStart = new Date(subscriptionStart)

        while (windowStart <= subscriptionEnd) {
            const windowEnd = new Date(windowStart);
            windowEnd.setDate(windowEnd.getDate() +  updateWindowInDays - 1);

            if (windowEnd > subscriptionEnd) {
                windowEnd.setTime(subscriptionEnd.getTime())
            }

            const cached = await getCachedPlayerWindow(playerId, windowStart, windowEnd);

            if (cached) { // If the specific window is already cached, then we can push it to statisticsPerWindow
                statisticsPerWindows.push({
                    windowStart,
                    windowEnd,
                    games: cached.gamesWithStats,
                    playerAverages: cached.playerAverages,
                })
            } else {
                const playerStatistics = await prisma.playerStatisticsPerGame.findMany({
                    where: {
                        playerId: playerId,
                        game: {
                            date: {
                                gte: windowStart,
                                lte: windowEnd,
                            },
                        },
                    },
                    include: {
                        game: true,
                    }
                })

                const gamesWithStats = transformPlayerStatisticsToGameWithStats(playerStatistics); 
                const playerAverages = computePlayerAverages(gamesWithStats);
                
                if (gamesWithStats.length > 0) {
                    await setCachedPlayerWindow(playerId, windowStart, windowEnd, gamesWithStats, playerAverages);
                }

                statisticsPerWindows.push({
                    windowStart,
                    windowEnd,
                    games: gamesWithStats,
                    playerAverages,
                })
            }
            windowStart.setDate(windowStart.getDate() + updateWindowInDays)
        }

        return res.json(statisticsPerWindows)
    } catch (error) {
        console.error("Error generating player summary with stats: ", error);
        res.status(500).json({message: "Failed to create the player summary"})
    }
})

module.exports = router;