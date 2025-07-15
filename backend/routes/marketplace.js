const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/player-marketplace", async (req, res) => {
  
});

module.exports = router;