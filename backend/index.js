const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json());
server.use(morgan("dev"));

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
