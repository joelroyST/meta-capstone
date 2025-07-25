const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session")
const dotenv = require("dotenv")
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan("dev"));

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7} // 1 week
  })
)

const authRouter = require("./routes/auth");
server.use("/auth", authRouter);
const userRouter = require("./routes/user");
server.use("/user", userRouter);
const leagueRouter = require("./routes/league");
server.use("/api/league", leagueRouter);
const fantasyTeamRouter = require("./routes/fantasyteam");
server.use("/api/fantasyteam", fantasyTeamRouter);
const playerRouter = require("./routes/player");
server.use("/api", playerRouter);
const marketplaceRouter = require("./routes/marketplace");
server.use("/api", marketplaceRouter);
const tradeRouter = require("./routes/trade");
server.use("/api", tradeRouter);
const tradepageRouter = require("./routes/tradepage");
server.use("/api", tradepageRouter);
const subscriptionRouter = require("./routes/subscription");
server.use("/api", subscriptionRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
