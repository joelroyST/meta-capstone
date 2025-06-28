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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
