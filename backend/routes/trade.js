const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
    const {proposerId, userId, leagueId} = req.body;
    try {
        const trade = await prisma.trade.create({
            data: {
                proposerId,
                tradeId: Date.now(),
                playersTo: [],
                userId,
                confirmation: 0,
            }
        })
        res.status(201).json(trade);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to create the trade propsosal"})
    }
})

export default router;