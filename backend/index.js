const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const chalk = require('chalk')

const server = express();

server.use(cors())
server.use(express.json())
server.use(morgan('dev'))

const authRouter = require('./routes/auth')
server.use("/auth", authRouter)
const PORT = process.env.PORT || 3000;