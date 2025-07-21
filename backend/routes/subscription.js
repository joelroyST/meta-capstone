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
        statsUpdateWindow: summaryFrequencyWeeks,
        updateFrequency: summaryFrequencyWeeks,
      },
    });

    res.status(201).json(newSubscription);
  } catch (error) {
    console.error("Error creating subscriptions: ", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

module.exports = router;