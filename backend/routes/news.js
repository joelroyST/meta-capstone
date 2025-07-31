const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/news", async (req, res) => {
    try {
        const articles = await prisma.newsArticle.findMany({
            orderBy: {id: "desc"},
        })
        res.json(articles);
    } catch (error) {
        console.error("Error trying to fetch news articles: ", error);
        res.status(500).json({error: "Unable to fetch the news articles"})
    }
})

module.exports = router;