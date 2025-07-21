const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = router;