const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { executeTrade } = require("../utils/tradehelper");

// To create a trade
router.post("/trade", async (req, res) => {
  const { proposerId, leagueId, tradeLegs } = req.body;
  
  const tradeId = generateRandomId();
  try {
    for (const leg of tradeLegs) {
      await prisma.trade.create({
        data: {
          tradeId: tradeId,
          proposerId: parseInt(proposerId),
          leagueId: parseInt(leagueId),
          user1Id: parseInt(leg.user1),
          user2Id: parseInt(leg.user2),
          user1PlayersToGive: leg.user1PlayersToGive,
          user2PlayersToGive: leg.user2PlayersToGive,
          confirmationUser1: 1,
          confirmationUser2: 1,
        },
      });
    }

    res.status(201).json({ message: "Trade created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create trade" });
  }
});

// GET trades for the logged in user
router.get("/trade/user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const trades = await prisma.trade.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });
    res.json(trades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch the trades" });
  }
});

// This confirms or rejects a trade
router.patch("/trade/:id/status", async (req, res) => {
  const { id } = req.params;
  const { userId, status } = req.body;

  try {
    const trade = await prisma.trade.findUnique({
      where: { recordId: parseInt(id, 10) },
    });
    if (!trade) return res.status(404).json({ error: "Trade not found" });
   
    const confirmField = "";
    if (trade.user1Id === userId) {
      confirmField = "confirmationUser1";
    } else {
      confirmField = "confirmationUser2";
    }

    await prisma.trade.update({
      where: { recordId: trade.recordId },
      data: { [confirmField]: status },
    });

    const legs = await prisma.trade.findMany({
      where: { tradeId: trade.tradeId },
    });

    // If any trade confirmation is 0, update the confirmationUsers to 0 because it means it's cancelled
    if (legs.some((leg) => leg.confirmationUser1 === 0 || leg.confirmationUser2 === 0)) {
      await prisma.trade.updateMany({
        where: { tradeId: trade.tradeId },
        data: { confirmationUser1: 0, confirmationUser2: 0 },
      });
      return res.json({
        message: "Trade was rejected by a user. The trade is now cancelled for everyone",
      });
    }

    // If all the users are confirmed then complete the trade
    if (legs.every((leg) => leg.confirmationUser1 === 2 && leg.confirmationUser2 === 2)) {
      await executeTrade(trade.tradeId);
      return res.json({ message: "Trade was fully confirmed and completed" });
    }

    // Otherwise it's still pending
    return res.json({
      message: "Confirmation recorded and waiting other users",
    });
  } catch (error) {
    console.error("There is an error in /trade/:id/status:", error);
    res
      .status(500)
      .json({ error: "There's been a server error while updating trade status" });
  }
});

function generateRandomId(min = 100000, max = 999999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

module.exports = router;
